-- ==========================================
-- 通路戰情地圖系統 (Channel War Map)
-- Supabase Schema SQL 基礎設計初稿
-- ==========================================

-- 1. 啟用 UUID 擴充功能 (Supabase 預設已啟用)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 建立通路類型 Enum/類別限制 (或直接用 CHECK CONSTRAINT)
-- 類別：合作通路 (partner)、洽談中 (negotiating)、待開發 (prospect)、已停止合作 (suspended)
CREATE TYPE channel_status AS ENUM ('partner', 'negotiating', 'prospect', 'suspended');

-- 3. 建立主要「通路資料表」 (channels)
CREATE TABLE IF NOT EXISTS public.channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type channel_status NOT NULL DEFAULT 'prospect',
    address TEXT NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    contact_name VARCHAR(100),
    phone VARCHAR(50),
    owner_sales VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    last_order_date DATE,
    monthly_sales NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    yearly_growth_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.0000, -- e.g., 0.1500 for 15%
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. 建立「商品庫存資料表」 (inventory_items)
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    safety_stock INTEGER NOT NULL DEFAULT 10 CHECK (safety_stock >= 0),
    expiry_date DATE NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. 建立「業務拜訪紀錄資料表」 (visit_records)
CREATE TABLE IF NOT EXISTS public.visit_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visitor VARCHAR(100) NOT NULL,
    purpose VARCHAR(150) NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 效能優化：建立常用查詢索引 (Indexes)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_channels_type ON public.channels(type);
CREATE INDEX IF NOT EXISTS idx_channels_owner ON public.channels(owner_sales);
CREATE INDEX IF NOT EXISTS idx_inventory_channel ON public.inventory_items(channel_id);
CREATE INDEX IF NOT EXISTS idx_visits_channel ON public.visit_records(channel_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON public.visit_records(visit_date DESC);

-- ==========================================
-- 觸發器 (Triggers)：自動更新 updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_channels_update_timestamp
    BEFORE UPDATE ON public.channels
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_update_timestamp();

-- ==========================================
-- 資料庫安全防護：Row Level Security (RLS)
-- ==========================================
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_records ENABLE ROW LEVEL SECURITY;

-- 建立預設安全存取政策 (簡單範例：所有登入帳號均可讀寫)
CREATE POLICY "Allow authenticated users full access to channels" 
    ON public.channels 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to inventory" 
    ON public.inventory_items 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to visits" 
    ON public.visit_records 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);
