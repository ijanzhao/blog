const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const KEY = '在此處貼上你那串超長的anon_key';

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "⏳ 正在讀取數據...";

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
        alert("錯誤詳情：" + err.message);
    }
}
