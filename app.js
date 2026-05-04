// 确保变量名和你在 index.html 中引用的一致
const SB_URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
// 请将下面这串 Key 替换为你刚刚从后台 Copy 出来的最新 Key
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

const supabase = window.supabase.createClient(SB_URL, SB_KEY);

// 对应 index.html 中的查询按钮
async function doSearch() {
    const resDiv = document.getElementById('result');
    resDiv.innerHTML = "📡 正在连接药材数据库...";
    
    try {
        // 注意：这里的 'species' 必须和你 Supabase 里的表名完全一致（注意大小写）
        const { data, error } = await supabase.from('species').select('*');
        if (error) throw error;
        
        resDiv.innerHTML = data.length > 0 
            ? JSON.stringify(data, null, 2) 
            : "⚠️ 数据库连接成功，但 'species' 表中没有数据。";
    } catch (e) {
        resDiv.innerHTML = "❌ 连接失败: " + e.message;
    }
}

// 对应 index.html 中的统计按钮
async function doStats() {
    const resDiv = document.getElementById('result');
    resDiv.innerHTML = "📊 正在生成代谢物统计...";
    
    try {
        const { data, error } = await supabase.from('metabolites').select('type');
        if (error) throw error;
        
        let count = {};
        data.forEach(item => {
            if (item.type) count[item.type] = (count[item.type] || 0) + 1;
        });
        resDiv.innerHTML = "统计结果：\n" + JSON.stringify(count, null, 2);
    } catch (e) {
        resDiv.innerHTML = "❌ 统计失败: " + e.message;
    }
}
