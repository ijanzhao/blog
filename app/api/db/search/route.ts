import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()

    if (!q) {
      return NextResponse.json({ species: [], compounds: [], effects: [] })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    const [speciesRes, compoundsRes, effectsRes] = await Promise.all([
      supabase
        .from('species')
        .select('id, name_zh, name_latin, description')
        .or(`name_zh.ilike.%${q}%,name_latin.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(20),
      supabase
        .from('compounds')
        .select('id, name, type, description')
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(20),
      supabase
        .from('effects')
        .select('id, name, description')
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(20),
    ])

    return NextResponse.json({
      species: (speciesRes.data ?? []).map((s: any) => ({
        id: s.id,
        name: s.name_zh,
        latin_name: s.name_latin,
        description: s.description,
      })),
      compounds: compoundsRes.data ?? [],
      effects: effectsRes.data ?? [],
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
