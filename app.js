// 確保這是檔案的第一行，沒有任何空格
const URL = 'https://gotdehypsbkbyrasdbrr.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

// 初始化
const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    // 只要這行字沒出現，就代表按鈕沒點動
    display.innerHTML = "⏳ 正在連接數據庫...";
    console.log("按鈕觸發成功");

    try {
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            let html = "<b>✅ 數據加載成功：</b><br><hr>";
            data.forEach(item => {
                html += `<b>🔹 ${item.compound_name || '未命名'}</b><br>機制: ${item.mechanism || '無'}<br><br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但資料表目前沒有數據。";
        }
    } catch (err) {
        display.innerHTML = "❌ 錯誤：" + err.message;
        alert("查詢失敗！詳情：" + err.message);
    }
}
