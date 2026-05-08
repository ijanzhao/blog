// 1. 初始化配置 (已更新為你截圖中正確的 Project URL)
const URL = 'https://gotdehypsbkbyrasdbrr.supabase.co';
const KEY = '在此處貼上你正確的超長 Anon Key'; 

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "⏳ 正在連接數據庫...";

    try {
        // 2. 查詢你的表 'compound_mechanisms'
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        // 3. 顯示結果
        if (data && data.length > 0) {
            let html = "<b>✅ 查詢成功：</b><br><hr>";
            data.forEach(item => {
                html += `<b>🔹 ${item.compound_name || '未命名'}</b><br>`;
                html += `機制: ${item.mechanism || '暫無描述'}<br><br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但表內目前沒有數據。";
        }
    } catch (err) {
        console.error(err);
        display.innerHTML = "❌ 錯誤：" + err.message;
        alert("查詢失敗！詳情：" + err.message);
    }
}
