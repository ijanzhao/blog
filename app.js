// 初始化 Supabase 客户端
const supabaseUrl = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 获取植物数据函数
async function fetchSpecies() {
    const display = document.getElementById("result");
    display.innerHTML = "正在加载数据...";
    
    try {
        const { data, error } = await supabase.from("species").select("*");
        if (error) throw error;
        display.innerHTML = data.length > 0 ? JSON.stringify(data, null, 2) : "暂无数据";
    } catch (err) {
        display.innerHTML = "❌ 错误: " + err.message;
    }
}

// 获取代谢物统计函数
async function fetchMetabolites() {
    const display = document.getElementById("result");
    display.innerHTML = "正在统计...";

    try {
        const { data, error } = await supabase.from("metabolites").select("type");
        if (error) throw error;

        let countMap = {};
        data.forEach(d => {
            if (d.type) countMap[d.type] = (countMap[d.type] || 0) + 1;
        });

        display.innerHTML = "📊 代谢物类型统计:\n" + JSON.stringify(countMap, null, 2);
    } catch (err) {
        display.innerHTML = "❌ 错误: " + err.message;
    }
}
