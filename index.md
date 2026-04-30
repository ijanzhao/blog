<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // 2. 直接填入你的 URL 和 Anon Key (从 Supabase Settings -> API 获取)
  const SUPABASE_URL = 'https://jgcibolwm...supabase.co'; 
  const SUPABASE_ANON_KEY = 'eyJhbG...'; 

  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function checkConnection() {
    try {
      // 注意：确保 'species' 表确实存在，且开启了 RLS 并在 RLS 中允许了 Select
      const { data, error } = await supabase
        .from('species')
        .select('*')
        .limit(1);

      if (error) throw error;
      console.log("连接成功:", data);
      // 这里添加逻辑：成功后隐藏“连接失败”提示，显示数据
    } catch (err) {
      console.error("连接失败详情:", err.message);
      document.getElementById('connection-msg').innerText = "数据库连接失败: " + err.message;
    }
  }

  checkConnection();
</script>
