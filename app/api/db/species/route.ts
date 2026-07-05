import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 联合查询物种基础数据与 species_meta
    const { data, error } = await supabase
      .from('species')
      .select(`
        id,
        name,
        latin_name,
        common_name,
        meta:species_meta(glyph, color, tier, trl, scores, sys_prompt)
      `);

    if (error) throw error;
    
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
