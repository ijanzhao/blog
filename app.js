// 1. 初始化配置 (請確保這兩項與你的 Supabase 專案完全一致)
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co'; 
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // 請保留你截圖中那串完整的 KEY

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "⏳ 正在連接數據庫，請稍候...";

    try {
        // 2. 核心查詢邏輯
        // 注意：這裡使用的是你 Supabase 中設定了 RLS 的表名 'compound_mechanisms'
        const { data, error } = await supabase
            .from('compound_mechanisms') 
            .select('*');

        // 3. 處理報錯
        if (error) throw error;

        // 4. 處理成功獲取的數據
        if (data && data.length > 0) {
            let html = '<div style="text-align: left; margin-top: 10px;"><b>✅ 成功獲取數據：</b><br><ul>';
            data.forEach(item => {
                // 這裡假設你的表中有 'name' 或 'mechanism' 字段，請根據實際字段名調整
                html += `<li>${item.compound_name || '未命名化合物'}: ${item.mechanism || '無機制描述'}</li>`;
            });
            html += '</ul></div>';
            display.innerHTML = html;
        } else {
            display.innerHTML = "⚠️ 連接成功，但數據庫中目前沒有數據。";
        }

    } catch (err) {
        // 5. 強化報錯提示：如果點不動，這裡會顯示為什麼
        console.error("發生錯誤:", err);
        display.innerHTML = `❌ 錯誤：${err.message || '無法連線到 Supabase'}`;
        alert("查詢失敗，請檢查：\n1. RLS 權限是否開啟\n2. 表名是否為 compound_mechanisms");
    }
}
