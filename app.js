// 1. 初始化 Supabase
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
// ⚠️ 請確保這串 KEY 是從你 Supabase 後台複製的完整 Anon Key
const KEY = '你的完整超長金鑰串'; 

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "⏳ 正在讀取資料庫...";

    try {
        // 2. 查詢你設定好權限的表 'compound_mechanisms'
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        // 3. 顯示結果
        if (data && data.length > 0) {
            let html = "<b>✅ 查詢成功：</b><br>";
            data.forEach(item => {
                html += `• ${item.compound_name || '未知'}: ${item.mechanism || '暫無描述'}<br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "⚠️ 連接成功，但資料表內目前沒有數據。";
        }
    } catch (err) {
        console.error(err);
        display.innerHTML = "❌ 錯誤：" + err.message;
        alert("查詢失敗，請檢查 Key 或 RLS 權限！");
    }
}
