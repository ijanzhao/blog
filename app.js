// 1. 初始化配置 (確保 URL 與 Project ID 一致)
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    // 只要顯示這行，就代表按鈕「點動了」
    display.innerHTML = "⏳ 正在連接數據庫...";

    try {
        // 2. 查詢資料表 'compound_mechanisms'
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        // 3. 顯示結果
        if (data && data.length > 0) {
            let html = "<b>✅ 獲取成功：</b><br><hr>";
            data.forEach(item => {
                html += `<b>🔹 ${item.compound_name || '未命名'}</b><br>機制: ${item.mechanism || '暫無'}<br><br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但資料表目前沒有數據。";
        }
    } catch (err) {
        display.innerHTML = "❌ 錯誤：" + err.message;
        alert("查詢失敗！原因：" + err.message);
    }
}
