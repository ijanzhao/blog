/**
 * Supabase 配置文件
 * 项目 ID: jgcibolwmwotsymhgtjr
 */
const SB_URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

// 初始化客户端
const supabase = window.supabase.createClient(SB_URL, SB_KEY);

/**
 * 1. 查询 compounds 表数据
 */
async function doSearch() {
    const resDiv = document.getElementById('result');
    resDiv.innerHTML = "📡 正在尝试连接数据库并检索 'compounds' 表...";

    try {
        // 根据截图 7，数据库中实际的表名是 compounds
        const { data, error } = await supabase
            .from('compounds')
            .select('*');

        if (error) {
            // 如果报错且信息包含 'JWT' 或 'policy'，通常是 RLS 策略问题
            throw error;
        }

        if (data && data.length > 0) {
            resDiv.innerHTML = "✅ 查询成功：\n" + JSON.stringify(data, null, 2);
        } else {
            resDiv.innerHTML = "⚠️ 连接成功，但 'compounds' 表中目前没有数据，或者 RLS 策略未允许读取。";
        }
    } catch (e) {
        resDiv.innerHTML = `<span class="error-msg">❌ 错误：${e.message}</span>\n\n提示：请检查 Supabase 后台是否为 'compounds' 表开启了 "Enable read access for all users" 策略。`;
        console.error("Supabase Error:", e);
    }
}

/**
 * 2. 统计 metabolites 表类型
 */
async function doStats() {
    const resDiv = document.getElementById('result');
    resDiv.innerHTML = "📊 正在统计 'metabolites' 类型分布...";

    try {
        const { data, error } = await supabase
            .from('metabolites')
            .select('type');

        if (error) throw error;

        if (data) {
            const stats = {};
            data.forEach(item => {
                if (item.type) {
                    stats[item.type] = (stats[item.type] || 0) + 1;
                }
            });
            resDiv.innerHTML = "📈 代谢物类型统计结果：\n" + JSON.stringify(stats, null, 2);
        }
    } catch (e) {
        resDiv.innerHTML = `<span class="error-msg">❌ 统计失败：${e.message}</span>`;
    }
}
