---
layout: default
title: 药材数据库
---

<div id="app">
  <header>
    <h1 style="color: white; margin: 0;">🌿 药材数据库</h1>
  </header>
  
  <div id="status-msg" class="msg">正在初始化连接...</div>
  
  <div id="data-grid" class="grid"></div>
</div>

<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 20px; }
  .card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #eee; }
  .msg { padding: 40px; text-align: center; color: #666; font-size: 1.2em; }
  header { background: #1a202c; padding: 30px; text-align: center; border-radius: 0 0 20px 20px; }
</style>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  // 强制指定配置，防止 Jekyll 干扰
  const CONF_URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
  const CONF_KEY = 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

  const _supabase = supabase.createClient(CONF_URL, CONF_KEY);

  async function main() {
    const status = document.getElementById('status-msg');
    const grid = document.getElementById('data-grid');

    try {
      // 这里的 'species' 必须和 Supabase 表名完全一致
      const { data, error } = await _supabase.from('species').select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        status.style.display = 'none';
        grid.innerHTML = data.map(item => `
          <div class="card">
            <h3 style="margin-top:0;">${item.name || '未知品种'}</h3>
            <p style="color:#666;">${item.description || '暂无详细描述'}</p>
          </div>
        `).join('');
      } else {
        status.innerText = "✅ 连接成功，但数据库 species 表里是空的。请去 Supabase 添加数据。";
      }
    } catch (e) {
      status.innerHTML = "❌ 连接失败<br><small>" + e.message + "</small>";
      console.error(e);
    }
  }

  main();
</script>

