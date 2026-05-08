// 1. 配置信息 (確保與截圖 image_23.png 一致)
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

// 2. 初始化 Supabase
const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    
    // 🔴 除錯測試：如果按鈕有點到，手機會先彈出這個視窗
    alert("按鈕觸發成功！正在連接數據庫...");
    
    display.innerHTML = "⏳ 正在讀取數據庫...";

    try {
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            let html = "<b>✅ 獲取成功：</b><br>";
            data.forEach(item => {
                html += `• ${item.compound_name || '未命名'}: ${item.mechanism || '無機制'}<br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "⚠️ 連接成功，但資料表目前沒有數據。";
        }
    } catch (err) {
        display.innerHTML = "❌ 錯誤：" + err.message;
        alert("資料抓取失敗：" + err.message);
    }
}
