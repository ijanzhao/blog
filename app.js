// 1. 初始化配置 (已根據 image_23.png 校對)
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co'; 
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    
    // 🔴 除錯標記：點擊按鈕後，這行字必須立即出現！
    display.innerHTML = "⏳ 正在啟動藥理數據查詢...";
    console.log("按鈕已被點擊");

    try {
        // 2. 查詢你的資料表 'compound_mechanisms'
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        // 3. 渲染結果
        if (data && data.length > 0) {
            let html = "<b>✅ 獲取成功：</b><br><hr>";
            data.forEach(item => {
                html += `<b>🔹 化合物: ${item.compound_name || '未命名'}</b><br>`;
                html += `機制: ${item.mechanism || '暫無數據'}<br><br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 資料庫連接成功，但目前表內沒有數據。";
        }
    } catch (err) {
        display.innerHTML = "❌ 查詢失敗：" + err.message;
        alert("出錯了！具體原因：" + err.message);
    }
}
