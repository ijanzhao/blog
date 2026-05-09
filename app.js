// 第一行不要有任何空行
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co'.trim();
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI'.trim();

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "⏳ 正在啟動數據庫連接測試...";
    console.log("按鈕觸發成功");

    try {
        const { data, error } = await supabase.from('compound_mechanisms').select('*');
        if (error) throw error;

        if (data && data.length > 0) {
            let html = "<b>✅ 數據抓取成功：</b><br>";
            data.forEach(item => {
                html += `• ${item.compound_name}: ${item.mechanism}<br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但資料表是空的。";
        }
    } catch (err) {
        display.innerHTML = "❌ 錯誤訊息：" + err.message;
        alert("報錯了：" + err.message);
    }
}
