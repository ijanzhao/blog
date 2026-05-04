# 🔬 WildPhytoDB

这是一个基于 Supabase 构建的野生植物代谢物科研平台。

### 📁 文件说明
- `index.html`: 前端主界面，包含搜索和统计展示。
- `app.js`: 核心逻辑，负责与 Supabase 进行数据交互。
- `detail.htm`: 化合物详细信息页面。

### ⚙️ 数据库配置
1. 项目 URL: `https://jgcibolwmwotsymhgtjr.supabase.co`
2. 表结构要求:
   - `species`: 存储物种信息。
   - `metabolites`: 存储代谢物，需包含 `type` 字段。
   - `v_compound_full`: 用于详情页展示的视图或表。

### ⚠️ 注意事项
如果出现 `401` 或 `403` 错误，请检查 Supabase 后台的 **Authentication -> Policies**，确保为匿名用户（anon）开启了读取（SELECT）权限。
