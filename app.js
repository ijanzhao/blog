// 1. 初始化配置 (已填入你提供的 Key，確保 URL 格式正確)
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "⏳ 正在讀取數據庫...";

    try {
        // 2. 查詢你設定好權限的表 'compound_mechanisms'
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        // 3. 渲染結果
        if (data && data.length > 0) {
            let html = "<b>✅ 獲取成功：</b><br><hr>";
            data.forEach(item => {
                html += `<b>🔹 ${item.compound_name || '未命名'}</b><br>`;
                html += `機制: ${item.mechanism || '暫無描述'}<br><br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但資料表目前沒有數據。";
        }
    } catch (err) {
        console.error(err);
        display.innerHTML = "❌ 錯誤：" + err.message;
        alert("查詢失敗！原因：" + err.message);
    }
}
