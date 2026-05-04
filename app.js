// 初始化配置
const URL = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI';

const supabase = window.supabase.createClient(URL, KEY);

async function fetchData() {
    const display = document.getElementById('result');
    display.innerHTML = "正在连接数据库...";

    try {
        // 根据截图 8 和 9，查询 compounds 表
        const { data, error } = await supabase.from('compounds').select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            display.innerHTML = "✅ 获取成功：\n" + JSON.stringify(data, null, 2);
        } else {
            // 如果看到下面这句话，说明 RLS 还没设置好，或者表里真的没数据
            display.innerHTML = "⚠️ 连接成功，但没有返回数据。\n请确保在 Supabase 后台为 'compounds' 表添加了 'Enable read access for all users' 策略。";
        }
    } catch (err) {
        display.innerHTML = "❌ 错误：" + err.message;
    }
}
