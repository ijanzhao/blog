const URL = ‘https://jgcibolwmwotsymhgtjr.supabase.co’;
const KEY = ‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI’;

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
const display = document.getElementById(‘result’);
display.innerHTML = “⏳ 正在讀取數據…”;

```
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
        display.innerHTML = "⚠️ 連接成功，但資料表目前為空。";
    }
} catch (err) {
    display.innerHTML = "❌ 錯誤：" + err.message;
    alert("數據抓取失敗！原因：" + err.message);
}
```

}
