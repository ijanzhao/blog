import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: '缺少问题内容' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    const q = question.trim()

    // 数据量不大，拉全量数据后在代码里判断"问题是否提到了这个名字"
    // （之前用 ilike 让字段反向包含整句问题，字段本身很短，永远匹配不上）
    const [speciesAll, compoundsAll, effectsAll, documentsAll, timelineAll] = await Promise.all([
      supabase
        .from('species')
        .select(`
          name_zh, name_latin, description,
          species_meta ( summary, trl, innov_score, market_score, track_id, tag )
        `),
      supabase.from('compounds').select('name, type, description'),
      supabase.from('effects').select('name, description'),
      supabase.from('documents').select('title, content, evidence_tier, confidence_grade'),
      supabase
        .from('evidence_timeline')
        .select('project_name, stage_name, status, evidence_level, confidence_grade, description'),
    ])

    const mentions = (text: string | null | undefined) =>
      !!text && q.includes(text)

    const speciesHits = (speciesAll.data ?? []).filter(
      (s: any) => mentions(s.name_zh) || mentions(s.name_latin)
    )
    const compoundsHits = (compoundsAll.data ?? []).filter((c: any) => mentions(c.name))
    const effectsHits = (effectsAll.data ?? []).filter((e: any) => mentions(e.name))
    const documentsHits = (documentsAll.data ?? []).filter((d: any) => mentions(d.title))
    const timelineHits = (timelineAll.data ?? []).filter(
      (t: any) => mentions(t.project_name) || mentions(t.stage_name)
    )

    // 关键词一个都没命中时，退化为创新分/市场分排名靠前的物种做通用背景
    let fallbackSpecies: any[] = []
    if (!speciesHits.length) {
      fallbackSpecies = (speciesAll.data ?? [])
        .slice()
        .sort((a: any, b: any) => {
          const am = Array.isArray(a.species_meta) ? a.species_meta[0] : a.species_meta
          const bm = Array.isArray(b.species_meta) ? b.species_meta[0] : b.species_meta
          return (bm?.innov_score ?? 0) - (am?.innov_score ?? 0)
        })
        .slice(0, 10)
    }

    const contextParts: string[] = []

    const speciesForContext = speciesHits.length ? speciesHits : fallbackSpecies
    if (speciesForContext.length) {
      contextParts.push(
        '相关物种：\n' +
          speciesForContext
            .map((s: any) => {
              const m = Array.isArray(s.species_meta) ? s.species_meta[0] : s.species_meta
              return `- ${s.name_zh}（${s.name_latin}）：${m?.summary || s.description || '暂无摘要'} [创新分${m?.innov_score ?? '-'} / 市场分${m?.market_score ?? '-'} / TRL${m?.trl ?? '-'}]`
            })
            .join('\n')
      )
    }

    if (compoundsHits.length) {
      contextParts.push(
        '相关化合物：\n' +
          compoundsHits.map((c: any) => `- ${c.name}（${c.type || '未分类'}）：${c.description || '暂无描述'}`).join('\n')
      )
    }

    if (effectsHits.length) {
      contextParts.push(
        '相关功效：\n' + effectsHits.map((e: any) => `- ${e.name}：${e.description || '暂无描述'}`).join('\n')
      )
    }

    if (documentsHits.length) {
      contextParts.push(
        '相关文献/治理记录：\n' +
          documentsHits
            .map((d: any) => `- 《${d.title}》[${d.evidence_tier || '未分级'}/${d.confidence_grade || '-'}级]：${(d.content || '').slice(0, 150)}...`)
            .join('\n')
      )
    }

    if (timelineHits.length) {
      contextParts.push(
        '相关证据时间轴：\n' +
          timelineHits
            .map((t: any) => `- [${t.project_name}] ${t.stage_name}（${t.status}，${t.evidence_level || '未分级'}/${t.confidence_grade || '-'}级）：${t.description || ''}`)
            .join('\n')
      )
    }

    const context = contextParts.length
      ? contextParts.join('\n\n')
      : '数据库中未检索到与问题直接相关的记录，请基于常识谨慎作答，并提醒用户这不是数据库内的确定信息。'

    const systemPrompt = `你是"冷域本草 · 研发智库"平台的研发顾问，服务对象是天然产物研发人员。
请只依据下面提供的数据库上下文回答问题，保持专业、简洁、可执行。
如果上下文没有覆盖问题，请明确说明"数据库中暂无相关记录"，不要编造具体数值或研究结论。
如果上下文中的文献/证据时间轴提示存在争议、反证或尚未完成（如status为planned、evidence_level为THEORETICAL_HYPOTHESIS），必须明确指出，不能把未完成或有争议的内容当作确定结论呈现。
回答用中文，控制在200字以内，可以用短句或要点列出。

数据库上下文：
${context}`

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'DEEPSEEK_API_KEY 未配置' }, { status: 500 })
    }

    const dsRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `
