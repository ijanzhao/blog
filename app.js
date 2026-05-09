const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co'.trim();
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI'.trim();

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "⏳ 正在启动数据库连接...";
    try {
        const { data, error } = await supabase.from('compound_mechanisms').select('*');
        if (error) throw error;
        display.innerHTML = data.length > 0 ? "✅ 成功获取数据" : "💡 数据库连接正常，但表内无数据";
    } catch (err) {
        display.innerHTML = "❌ 连接失败：" + err.message;
    }
}
