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

    const { data: compoundLinks } = await supabase
      .from('species_compounds')
      .select('compounds ( id, name, type, description )')
      .eq('species_id', id)

    const { data: effectLinks } = await supabase
      .from('species_effects')
      .select('effects ( id, name, description )')
      .eq('species_id', id)

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('species_id', id)
      .order('sort_order', { ascending: true })

    return NextResponse.json({
      ...species,
      compounds: compoundLinks?.map((c: any) => c.compounds) ?? [],
      effects: effectLinks?.map((e: any) => e.effects) ?? [],
      products: products ?? [],
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
