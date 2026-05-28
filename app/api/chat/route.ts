import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { system, messages, max_tokens } = await req.json();
    const dsMessages = system
      ? [{ role: "system", content: system }, ...messages]
      : messages;
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: dsMessages,
        max_tokens: max_tokens || 1000
      })
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "无法获取回复";
    return NextResponse.json({
      content: [{ type: "text", text }]
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
