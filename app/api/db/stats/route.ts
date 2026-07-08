import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    const [species, compounds, effects, products, research] = await Promise.all([
      supabase.from('species').select('*', { count: 'exact', head: true }),
      supabase.from('compounds').select('*', { count: 'exact', head: true }),
      supabase.from('effects').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('natural_product_research').select('*', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      total_species: species.count ?? 0,
      total_compounds: compounds.count ?? 0,
      total_effects: effects.count ?? 0,
      total_products: products.count ?? 0,
      total_research_records: research.count ?? 0,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
