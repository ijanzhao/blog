<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>药材数据库</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
body {font-family:-apple-system;background:#f4f6f8;margin:0}
header{background:#0f172a;color:#fff;padding:20px;text-align:center}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;padding:20px}
.card{background:#fff;padding:20px;border-radius:12px}
</style>
</head>

<body>

<header>
<h1>🌿 药材数据库</h1>
</header>

<div class="grid" id="grid"></div>

<script>
const supabaseUrl = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const supabaseKey = 'sb_publishable_K_DnINBvp73Wf4XrvbTbtw_49N2e20u';

const client = supabase.createClient(supabaseUrl, supabaseKey);

async function loadData() {
  const { data, error } = await client
    .from('species')
    .select('*');

  const grid = document.getElementById("grid");

  if (error) {
    grid.innerHTML = "数据库连接失败";
    return;
  }

  if (!data || data.length === 0) {
    grid.innerHTML = "没有数据";
    return;
  }

  grid.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${item.name_zh}</h3>
      <p>${item.name_latin}</p>
    `;
    grid.appendChild(div);
  });
}

loadData();
</script>

</body>
</html>
