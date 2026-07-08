import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    const { data: species, error: speciesError } = await supabase
      .from('species')
      .select(`
        id, name_zh, name_latin, description, created_at,
        species_meta (
          glyph, color, accent, tier, tag, alias, summary,
          trl, innov_score, market_score, track_id, sys_prompt
        )
      `)
      .eq('id', id)
      .single()

    if (speciesError) {
      return NextResponse.json({ error: speciesError.message }, { status: 404 })
    }

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('species_id', id)
      .order('sort_order', { ascending: true })

    const productIds = (products ?? []).map((p: any) => p.id)

    let processSteps: any[] = []
    if (productIds.length > 0) {
      const { data: steps } = await supabase
        .from('process_steps')
        .select('step_order, step_name, step_detail, product_id')
        .in('product_id', productIds)
        .order('step_order', { ascending: true })

      processSteps = (steps ?? []).map((s: any) => ({
        step_number: s.step_order,
        title: s.step_name,
        detail: s.step_detail,
      }))
    }

    return NextResponse.json({
      id: species.id,
      name: species.name_zh,
      latin_name: species.name_latin,
      description: species.description,
      meta: species.species_meta ? [species.species_meta] : [],
      products: products ?? [],
      process_steps: processSteps,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
