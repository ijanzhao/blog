---
layout: default
title: 藥材資料庫
---

<div id="app">
  <header>
    <h1>🌿 藥材資料庫</h1>
  </header>
  <div id="status-msg" class="msg">正在讀取數據...</div>
  <div id="data-grid" class="grid"></div>
</div>

<style>
  body { font-family: sans-serif; background: #f4f6f8; margin: 0; }
  header { background: #0f172a; color: #fff; padding: 20px; text-align: center; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 20px; }
  .card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
  .msg { padding: 40px; text-align: center; color: #666; }
</style>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
  const SUPABASE_ANON_KEY = 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

  const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function loadData() {
    const statusEl = document.getElementById('status-msg');
    const gridEl = document.getElementById('data-grid');
    try {
      const { data, error } = await _supabase.from('species').select('*');
      if (error) throw error;
      if (data.length > 0) {
        statusEl.style.display = 'none';
        gridEl.innerHTML = data.map(item => `
          <div class="card">
            <h3>${item.name || '無名稱'}</h3>
            <p>${item.description || '無描述'}</p>
          </div>
        `).join('');
      } else {
        statusEl.innerText = "資料庫已連線，但表內目前沒有數據。";
      }
    } catch (err) {
      statusEl.innerText = "連線失敗：" + err.message;
    }
  }
  loadData();
</script>
