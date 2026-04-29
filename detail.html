<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>药材数据库</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
body {font-family:-apple-system;background:#f4f6f8;margin:0}
header{background:#0f172a;color:#fff;padding:20px;text-align:center}
input{width:80%;padding:12px;margin:20px auto;display:block;border-radius:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;padding:20px}
.card{background:#fff;padding:20px;border-radius:12px;cursor:pointer}
.tag{font-size:12px;color:#666;margin-top:10px}
</style>
</head>

<body>

<header>
<h1>🌿 药材数据库系统</h1>
</header>

<input id="search" placeholder="搜索药材..." onkeyup="loadData()">

<div class="grid" id="grid"></div>

<script>
const supabaseUrl = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const supabaseKey = 'sb_publishable_K_DnINBvp73Wf4XrvbTbtw_49N2e20u';

const client = supabase.createClient(supabaseUrl, supabaseKey);

async function loadData(){
  const keyword = document.getElementById("search").value;

  const { data } = await client
    .from('species')
    .select('*')
    .ilike('name_zh', `%${keyword}%`);

  const grid = document.getElementById("grid");

  grid.innerHTML = data.map(item=>`
    <div class="card" onclick="goDetail('${item.id}')">
      <h3>${item.name_zh}</h3>
      <p>${item.name_latin}</p>
      <div class="tag">${item.category} · ${item.risk_level}</div>
    </div>
  `).join('');
}

function goDetail(id){
  window.location.href=`detail.html?id=${id}`;
}

loadData();
</script>

</body>
</html>
