// 1. 配置信息
const URL = 'https://gotdehypsbkbyrasdbrr.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

// 初始化 Supabase 客戶端
const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    
    // 只要按鈕有點到，這行字一定會先出現
    display.innerHTML = "⏳ 正在連接數據庫...";
    console.log("開始查詢...");

    try {
        // 2. 執行查詢
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        // 3. 顯示結果
        if (data && data.length > 0) {
            let html = "<b>✅ 查詢成功：</b><br><hr>";
            data.forEach(item => {
                html += `<b>🔹 ${item.compound_name || '未知'}</b><br>機制: ${item.mechanism || '無'}<br><br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但資料表目前是空的。";
        }
    } catch (err) {
        console.error(err);
        display.innerHTML = "❌ 出錯了：" + err.message;
        alert("查詢失敗，原因：" + err.message);
    }
}
