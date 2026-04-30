---
layout: default
title: 药材数据库
---

<div id="app">
  <header>
    <h1>🌿 药材数据库</h1>
  </header>
  
  <div id="status-msg" class="msg">正在连接数据库...</div>
  
  <div id="data-grid" class="grid">
    </div>
</div>

<style>
  body { font-family: -apple-system, sans-serif; background: #f4f6f8; margin: 0; }
  header { background: #0f172a; color: #fff; padding: 20px; text-align: center; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 20px; }
  .card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .card h3 { margin: 0 0 8px; font-size: 18px; color: #1a1a1a; }
  .card p { margin: 0; font-style: italic; color: #555; font-size: 14px; }
  .msg { padding: 40px; text-align: center; color: #666; font-size: 15px; }
  .err { color: #c0392b; font-weight: bold; }
</style>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // 1. 配置信息 (已根据你提供的信息填入)
  const SUPABASE_URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
  const SUPABASE_ANON_KEY = 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

  // 2. 初始化客户端
  const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function loadData() {
    const statusEl = document.getElementById('status-msg');
    const gridEl = document.getElementById('data-grid');

    try {
      // 3. 从 'species' 表获取数据
      // 注意：请确保你的 Supabase 表名确实是小写的 species
      const { data, error } = await _supabase
        .from('species')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        statusEl.style.display = 'none';
        gridEl.innerHTML = data.map(item => `
          <div class="card">
            <h3>${item.name || '未命名'}</h3>
            <p>${item.description || '暂无描述'}</p>
          </div>
        `).join('');
      } else {
        statusEl.innerText = "数据库连接成功，但表中没有数据。";
      }

    } catch (err) {
      console.error(err);
      statusEl.classList.add('err');
      statusEl.innerText = "数据库连接失败: " + err.message;
    }
  }

  // 执行加载
  loadData();
</script>
