// 確保網址開頭沒有空格，結尾沒有多餘斜槓
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co'.trim();
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI'.trim();

// 檢查 Supabase 是否加載成功
if (!window.supabase) {
    console.error("Supabase 庫未加載，請檢查 index.html 中的 script 標籤");
}

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "⏳ 正在檢索藥理數據...";

    try {
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            let html = "<b>🧬 檢索結果：</b><br>";
            data.forEach(item => {
                html += `• ${item.compound_name}: ${item.mechanism}<br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但表內暫無數據。";
        }
    } catch (err) {
        // 這裡會捕獲 URL 格式錯誤或網路問題
        display.innerHTML = "❌ 錯誤：" + err.message;
        console.error(err);
    }
}
