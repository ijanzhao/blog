import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const { plantId, plantName, activeCompounds, stressFactors } = await req.json();

    if (!plantName) {
      return NextResponse.json({ success: false, error: '缺少植物物種名稱' }, { status: 400 });
    }

    const aiResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          {
            role: 'system',
            content: '你是一個精通冷域植物次生代謝與天然產物藥理學的 AI 專家。請針對用戶提供的冷涼逆境野生植物，深度推導其環境脅迫誘導的次生代謝物演變、藥理機制通路（如作用於 Na+/K+-ATPase 泵、細胞自噬與凋亡）。請輸出具有學術嚴謹性的結構化報告。'
          },
          {
            role: 'user',
            content: `植物物種: ${plantName}. 核心成分: ${activeCompounds || '未指定'}. 逆境因子: ${stressFactors || '冷涼、高海拔、極端溫差'}. 請生成深度研發智庫報告。`
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`DeepSeek 錯誤: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const markdownReport = aiData.choices[0].message.content;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase 環境變數未就緒');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: dbRecord, error: dbError } = await supabase
      .from('analysis_reports')
      .insert({
        plant_id: plantId || null,
        pharmacology_mechanism: markdownReport,
        status: 'completed',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      reportId: dbRecord?.id,
      data: markdownReport
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
