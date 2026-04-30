<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>药材数据库</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
body { font-family: -apple-system, sans-serif; background: #f4f6f8; margin: 0; }
header { background: #0f172a; color: #fff; padding: 20px; text-align: center; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 20px; }
.card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.card h3 { margin: 0 0 8px; font-size: 18px; color: #1a1a1a; }
.card p  { margin: 0; font-style: italic; color: #555; font-size: 14px; }
.msg { padding: 40px; text-align: center; color: #666; font-size: 15px; }
.err { color: #c0392b; }
</style>
</head>
<body>

<header>
  <h1>🌿 药材数据库</h1>
</header>

<div id="root"><p class="msg">正在加载…</p></div>

<script>
const SUPABASE_URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadData() {
  const root = document.getElementById('root');

  const { data, error } = await client.from('species').select('*');

  if (error) {
    root.innerHTML = `<p class="msg err">连接失败：${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    root.innerHTML = '<p class="msg">暂无数据</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'grid';

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const h3 = document.createElement('h3');
    h3.textContent = item.name_zh || '—';

    const p = document.createElement('p');
    p.textContent = item.name_latin || '—';

    card.appendChild(h3);
    card.appendChild(p);
    grid.appendChild(card);
  });

  root.innerHTML = '';
  root.appendChild(grid);
}

loadData();
</script>
</body>
</html>
