// 1. 初始化 Supabase 配置
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co'; // 確保前後無空格
const KEY = '在此處貼上你從Supabase複製的超長KEY'; 

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "⏳ 正在讀取數據庫...";

    // 檢查 SDK 是否成功加載
    if (!window.supabase) {
        alert("錯誤：Supabase SDK 未加載，請檢查網路或 index.html 第 7 行。");
        return;
    }

    try {
        const supabase = window.supabase.createClient(URL, KEY);

        // 2. 查詢你設定了 RLS 權限的表 'compound_mechanisms'
        const { data, error } = await supabase
            .from('compound_mechanisms')
            .select('*');

        if (error) throw error;

        // 3. 渲染結果
        if (data && data.length > 0) {
            let html = "<b>✅ 查詢成功：</b><br><hr>";
            data.forEach(item => {
                html += `<b>${item.compound_name || '未知化合物'}</b><br>`;
                html += `機制: ${item.mechanism || '暫無描述'}<br><br>`;
            });
            display.innerHTML = html;
        } else {
            display.innerHTML = "💡 連接成功，但資料表目前沒有數據。";
        }
    } catch (err) {
        console.error(err);
        display.innerHTML = "❌ 失敗：" + err.message;
        // 這會彈出你看到的 Invalid URL 或其他錯誤詳情
        alert("數據抓取失敗！原因：" + err.message);
    }
}
