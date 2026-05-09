// 確保第一行沒有空行
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co'.trim();
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI'.trim();

// 初始化 Supabase 客戶端
const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    
    // 🔴 狀態更新：只要看到這行字，就說明按鈕已經「點動了」
    display.innerHTML = "⏳ 正在連接藥理數據庫...";

    try {
        // 執行查詢
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        // 渲染數據
        if (data && data.length > 0) {
            let html = "<b>✅ 數據抓取成功：</b><br><hr>";
            data.forEach(item => {
                html += `<b>🔹 化合物:</b> ${item.compound_name || '未知'}<br>`;
                html += `<b>🔬 機制:</b> ${item.mechanism || '尚未登錄'}<br><br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但目前資料表中沒有數據。";
        }
    } catch (err) {
        // 捕捉並顯示詳細報錯內容
        display.innerHTML = "❌ 報錯訊息：" + err.message;
        console.error("Supabase Error:", err);
    }
}
