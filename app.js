// 1. 初始化配置 (已修正变量名和Key)
const supabaseUrl = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. 查询函数
async function handleSearch() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "正在查询中...";

    try {
        // 尝试从 species 表获取数据
        const { data, error } = await supabase
            .from("species")
            .select("*");

        if (error) throw error;

        resultDiv.innerHTML = data.length > 0 
            ? JSON.stringify(data, null, 2) 
            : "未找到相关物种数据。";
    } catch (err) {
        resultDiv.innerHTML = "❌ 查询失败: " + err.message;
        console.error(err);
    }
}

// 3. 统计函数
async function handleStats() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "正在统计...";

    try {
        const { data, error } = await supabase
            .from("metabolites")
            .select("type");

        if (error) throw error;

        let count = {};
        data.forEach(item => {
            if (item.type) {
                count[item.type] = (count[item.type] || 0) + 1;
            }
        });

        resultDiv.innerHTML = "📊 代谢物类型统计：\n" + JSON.stringify(count, null, 2);
    } catch (err) {
        resultDiv.innerHTML = "❌ 统计失败: " + err.message;
        console.error(err);
    }
}
