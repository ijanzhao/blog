export type DoseSource = { label: string; min: number; max: number }
type DoseEntry = { name: string; names: string[]; sources: DoseSource[]; restricted: boolean }

export type SpeciesLike = {
  name_zh: string
  name_latin?: string | null
  description?: string | null
}
export type HerbDoseRow = {
  name_zh: string
  name_aliases?: string[] | null
  dose_min: number | string | null
  dose_max: number | string | null
  source: string
  source_edition: string
}
export type DoseLine = { name: string; grams: number; flag: '✓' | '⚠' | '○'; text: string }

const RESTRICTED = /^(Aconitum|Aristolochia|Adonis)\b/i
const NOISE_PREFIX = /^(?:请|帮我|帮忙|核对|检查|看看|方剂|处方|方子|药物|剂量|用量|方中|如下|以下)+/

// 物种记录里的用量：兼容【用量】【用法用量】【用法与用量】，取第一个「数字~数字」
export const parseDoseRange = (desc?: string | null) => {
  const raw = desc?.match(/【(?:用法与用量|用法用量|用量)】([^【]+)/)?.[1]
  const m = raw?.match(/(\d+(?:\.\d+)?)\s*[~～\-–—至到]\s*(\d+(?:\.\d+)?)/)
  return m ? { min: Number(m[1]), max: Number(m[2]) } : null
}
// 物种记录里的用量：兼容【用量】【用法用量】【用法与用量】，取第一个「数字~数字」
export const parseDoseRange = (desc?: string | null) => {
  const raw = desc?.match(/【(?:用法与用量|用法用量|用量)】([^【]+)/)?.[1]
  const m = raw?.match(/(\d+(?:\.\d+)?)\s*[~～\-–—至到]\s*(\d+(?:\.\d+)?)/)
  return m ? { min: Number(m[1]), max: Number(m[2]) } : null
}
export const parseBencaozhiRange = parseDoseRange

// 来源标签按证据标注：描述里明确提到《太白山本草志》才标它
export const speciesSourceLabel = (desc?: string | null) =>
  desc?.includes('《太白山本草志》') ? '《太白山本草志》' : '库内物种记录'

const buildEntries = (speciesHits: SpeciesLike[], herbRows: HerbDoseRow[]) => {
  const entries: DoseEntry[] = []
  const upsert = (names: string[], display: string, src: DoseSource | null, restricted: boolean) => {
    let e = entries.find((x) => x.names.some((n) => names.includes(n)))
    if (!e) {
      e = { name: display, names: [], sources: [], restricted: false }
      entries.push(e)
    }
    for (const n of names) if (n && !e.names.includes(n)) e.names.push(n)
    if (restricted) e.restricted = true
    if (src && !e.sources.some((s) => s.label === src.label && s.min === src.min && s.max === src.max)) {
      e.sources.push(src)
    }
  }
  for (const s of speciesHits) {
    const r = parseDoseRange(s.description)
    upsert([s.name_zh], s.name_zh, r ? { label: speciesSourceLabel(s.description), ...r } : null, RESTRICTED.test(s.name_latin ?? ''))
  }
  for (const h of herbRows) {
    const min = h.dose_min == null ? NaN : Number(h.dose_min)
    const max = h.dose_max == null ? NaN : Number(h.dose_max)
    const ok = Number.isFinite(min) && Number.isFinite(max)
    upsert(
      [h.name_zh, ...(h.name_aliases ?? [])],
      h.name_zh,
      ok ? { label: `${h.source}${h.source_edition}`, min, max } : null,
      false
    )
  }
  return entries
}

export const evaluateFormula = (q: string, speciesHits: SpeciesLike[], herbRows: HerbDoseRow[]) => {
  const found = Array.from(q.matchAll(/([\u4e00-\u9fa5]+)\s*(\d+(?:\.\d+)?)\s*(?:克|g|G)/g))
  if (found.length < 3) return null
  const entries = buildEntries(speciesHits, herbRows)
  const seen = new Set<string>()
  const duplicates: string[] = []
  const lines: DoseLine[] = []

  for (const m of found) {
    const raw = m[1].replace(NOISE_PREFIX, '')
    if (!raw) continue
    const grams = Number(m[2])
    const e = entries.find((x) => x.names.includes(raw))
    const name = e ? e.name : raw
    if (seen.has(name)) {
      duplicates.push(name)
      continue
    }
    seen.add(name)

    let flag: DoseLine['flag'] = '○'
    let detail = '药名未能匹配到数据库记录，无法判断'
    if (e && e.restricted) {
      detail = '按平台政策不提供剂量信息，请由专业人员核查'
    } else if (e && e.sources.length > 0) {
      const checks = e.sources.map((s) => ({ s, over: grams > s.max, under: grams < s.min }))
      flag = checks.some((c) => c.over || c.under) ? '⚠' : '✓'
      detail = checks
        .map((c) => `${c.s.label} ${c.s.min}~${c.s.max}g，${c.over ? '超出上限' : c.under ? '低于下限' : '范围内'}`)
        .join('；')
    } else if (e) {
      detail = '两处剂量参考均无记录，无法判断'
    }
    lines.push({ name, grams, flag, text: `${flag} ${name} ${grams}克（${detail}）` })
  }
  if (lines.length === 0) return null

  const count = (f: DoseLine['flag']) => lines.filter((l) => l.flag === f).length
  const header = `【剂量核对】（共${lines.length}味：✓${count('✓')} ⚠${count('⚠')} ○${count('○')}）`
  const dup = duplicates.length ? `\n注：以下药名重复出现，仅按首次剂量核对：${duplicates.join('、')}` : ''
  return { lines, block: header + '\n' + lines.map((l) => l.text).join('\n') + dup }
}

// 固定段落由服务端输出；模型只保留【合规与安全提示】，其余内容一律丢弃
const FIXED_SECTIONS =
  '【说明】未收录不等于剂量合理，○类药物请对照药典自行核查。\n\n【配伍禁忌】数据库没有十八反、十九畏数据，未检查。'

// 固定段落由服务端输出；模型只保留【合规与安全提示】，其余内容一律丢弃
const FIXED_SECTIONS =
  '【说明】未收录不等于剂量合理，○类药物请对照药典自行核查。\n\n【配伍禁忌】数据库没有十八反、十九畏数据，未检查。'

export const composeAnswer = (doseBlock: string | null, llmText: string) => {
  if (!doseBlock) return llmText
  const compliance =
    llmText.match(/【合规与安全提示】[\s\S]*$/)?.[0]?.trim() ??
    '【合规与安全提示】数据库中暂无相关记录。'
  return `${doseBlock}\n\n${FIXED_SECTIONS}\n\n${compliance}`
}
