-- ══════════════════════════════════════════
--  药材数据库 · species 表
--  在 Supabase 控制台 → SQL Editor 中运行
-- ══════════════════════════════════════════

-- 1. 建表
CREATE TABLE IF NOT EXISTS public.species (
  id           BIGSERIAL PRIMARY KEY,
  name_zh      TEXT NOT NULL,          -- 中文名，如 "铁筷子"
  name_latin   TEXT NOT NULL,          -- 拉丁学名，如 "Helleborus thibetanus"
  family_zh    TEXT,                   -- 科名（中文），如 "毛茛科"
  part_used    TEXT,                   -- 药用部位，如 "根茎"
  category     TEXT,                   -- 分类，如 "有毒中草药"
  notes        TEXT,                   -- 备注
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 插入示例数据（可删除）
INSERT INTO public.species (name_zh, name_latin, family_zh, part_used, category) VALUES
  ('铁筷子', 'Helleborus thibetanus', '毛茛科', '根茎', '有毒中草药'),
  ('黄连',   'Coptis chinensis',      '毛茛科', '根茎', '清热燥湿药'),
  ('川贝母', 'Fritillaria cirrhosa',  '百合科', '鳞茎', '化痰止咳药');

-- 3. 开启 RLS（Row Level Security）
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;

-- 4. RLS 策略：匿名用户只读（前端展示用）
CREATE POLICY "allow_anon_read"
  ON public.species
  FOR SELECT
  TO anon
  USING (true);

-- 5. RLS 策略：已登录用户不可增删改
CREATE POLICY "allow_auth_write"
  ON public.species
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
