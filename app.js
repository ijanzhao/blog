// 1. 初始化 (請確保這兩行沒有多餘的空格或字符)
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
// ⚠️ 重要：請把下面引號裡的內容替換成你 Supabase 後台 API 頁面那個超長的 anon key
const KEY = '在此處粘貼你最長的那串KEY'; 

// 這裡加入檢查，防止 SDK 沒加載好就執行
window.onload = function() {
    console.log("網頁加載完成，ijan.app 準備就緒");
};

async function fetchData() {
    const display = document.getElementById('result');
    
    // 立即顯示反饋，證明「按鈕點動了」
    display.innerHTML = "⏳ 正在連接數據庫...";
    console.log("按鈕已點擊");

    // 如果 Supabase SDK 沒加載成功，直接彈窗報錯
    if (!window.supabase) {
        alert("錯誤：Supabase 庫沒加載成功，請檢查 index.html 第 7 行！");
        return;
    }

    try {
        const supabase = window.supabase.createClient(URL, KEY);

        // 2. 查詢數據 (確保表名是 compound_mechanisms)
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        // 3. 渲染數據
        if (data && data.length > 0) {
            let html = '<ul style="padding-left:20px;">';
            data.forEach(item => {
                html += `<li><b>${item.compound_name || '未命名'}</b>: ${item.mechanism || '無描述'}</li>`;
            });
            html += '</ul>';
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但資料庫裡目前是空的。";
        }

    } catch (err) {
        console.error("發生錯誤:", err);
        display.innerHTML = "❌ 失敗: " + err.message;
        // 彈出具體原因，如果是 Key 錯了，這裡會顯示 Invalid API Key
        alert("數據抓取失敗！具體原因：" + err.message);
    }
}
