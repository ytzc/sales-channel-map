# 通路戰情地圖系統 (Channel War Map) 🗺️🎯

這是一個專為產品經理、業務主管、業務代表打造的**地圖式通路 CRM 與營運決策戰情室**。系統整合了通路地理位置、即時庫存現況、過期效期追蹤、叫貨回購頻率與業務拜訪紀錄，協助企業進行高效補貨，降低產品過期损失，並將通路拜訪客情維繫與開發流程高度現代化。

---

## 🚀 專案背景與痛點解決

在傳統通路營運中，藥局、診所、母嬰用品店等實體零售點的維護面臨以下痛點：
- **資訊孤島**：位置資料在 Google Maps、庫存銷量在 ERP、拜訪記錄在 Excel、產品到期日在業務腦中。
- **效率低下**：業務代表難以即時知道「今天該去哪家店補貨？」、「哪家店的產品快過期了？」。
- **流失預警缺失**：對於久未叫貨的「失溫」通路缺乏自動化視覺化提示，導致客戶無聲流失。

本系統以**「地圖」**為核心，將所有營運與客情指標進行「視覺化圖層化」渲染，使業務主管與人員可以在一秒鐘內以地圖雷達方式掌握全局戰況。

---

## 🎯 產品定位

**地圖式通路 CRM / 通路營運儀表板**。  
融合地理資訊系統 (GIS) 與輕量 CRM，未來可擴充成多租戶 SaaS 訂閱制通路營運平台。

---

## 👥 使用者角色與核心價值

### 1. 業務人員 (Sales Representatives)
- **核心價值**：提高巡店效率，精準進行補貨與到期促銷。
- **看板聚焦**：
  - 哪些店的庫存已經低於安全水位，急需前往補貨？
  - 哪些店的商品將在六個月內到期，需要進行效期促銷？
  - 哪些合作通路太久沒叫貨，可能有轉移至競爭對手的風險？
  - 本日前往大安區，有哪些「待開發」與「洽談中」的潛力通路可以順道拜訪？

### 2. 業務主管 (Sales Managers)
- **核心價值**：掌控區域業績，優化團隊人效與通路健康度。
- **看板聚焦**：
  - 台北市各區域 (大安、信義、中山) 的通路業績分佈圖。
  - 團隊業務代表的最新巡店拜訪軌跡與客訴反饋。
  - 通路健康度比例（活躍通路 vs 失溫通路）。
  - 通路潛力分級 (A / B / C 級) 的分佈現況。

---

## 💎 MVP 功能範圍 (本機執行版)

本 MVP 已完整實現免對接 ERP 的 100% 獨立運行機制：
1. **首頁儀表板 (Dashboard)**：即時彙整總通路數、零庫存數、效期急迫數與失溫通路數；提供「即時告警中心」及「建議回訪清單」。
2. **通路清單管理**：提供關鍵字搜尋與「通路類型」、「潛力等級」複合式篩選；包含「開發新通路」彈出表單，填寫即可即時更新清單。
3. **通路詳細戰情室**：
   - 產品在庫清單、安全水位狀態、產品到期日及剩餘效期。
   - 業務拜訪歷史時間軸。
   - **「登錄今日拜訪記事」**互動表單，提交即可即時反映於客情歷程。
4. **戰術地圖頁面 (Map)**：整合台北市經緯度標記，支持 4 大主題戰情圖層切換：
   - 🏪 **營運通路圖層**：依通路類型（合作中、洽談、待開發、終止）標示顏色。
   - 📦 **庫存分析圖層**：一鍵將地圖切換為庫存健康度（正常、低水位、缺貨告警）。
   - ⏳ **效期追蹤圖層**：依商品最快到期日，顯示臨期警戒（安全、臨期、急迫）。
   - ❄️ **叫貨頻率圖層**：依最後叫貨時間長短，偵測通路溫度（正常、關注、警示、失溫）。
5. **高度相容的 fallback 地圖機制**：檢測到無 Mapbox 憑證時，自動啟動極具科技感與互動感的「Taipei 戰術網格地圖」，保證 100% 開箱即用！

---

## 🛠️ 技術架構

本系統採用現代化、高擴充性的前端與雲端無伺服器架構：

- **核心框架**：[Next.js 14.2.3](https://nextjs.org/) (App Router 實作，效能與路由極致優化)
- **開發語言**：[TypeScript](https://www.typescript.org/) (完整型別安全定義，避免運行時錯誤)
- **視覺樣式**：[Tailwind CSS](https://tailwindcss.com/) (現代化、高彈性 Utility-First 樣式設計)
- **地圖渲染**：[Mapbox GL JS](https://www.mapbox.com/) / [react-map-gl](https://visgl.github.io/react-map-gl/)
- **圖示庫**：[Lucide React](https://lucide.dev/) (高清晰、現代化圖示)
- **雲端資料庫**：[Supabase](https://supabase.com/) (預先設計好 SQL 實體關聯、RLS 政策與索引優化)
- **自動部署 (CI/CD)**：GitHub Actions (設定 on-tag 觸發自動靜態 HTML 匯出並部署至 GitHub Pages)

---

## 📊 系統架構圖

### 1. 系統運行架構
```mermaid
graph TD
    Client[Next.js App Client / Monospace UI] -->|1. 讀取與篩選| StateManager[React State Manager]
    StateManager -->|驅動資料| MapBoxLayer[Mapbox GL JS / 台北戰術地圖]
    StateManager -->|數據運算| UtilFuncs[Utility 規則運算模組]
    
    subgraph Utility 規則引擎 (utils/status.ts)
        UtilFuncs --> ExpiryCheck[效期計算: 剩餘月份]
        UtilFuncs --> StockCheck[庫存對比: 安全水位]
        UtilFuncs --> OrderCheck[回購天數: 0~90天+]
        UtilFuncs --> PotentialCalc[潛力分級: A/B/C Scoring]
    end
    
    NextStep[未來 SaaS 階段] -.->|API 整合| SupabaseAPI[Supabase Client API]
    SupabaseAPI -.->|資料庫儲存| SupabaseDB[(PostgreSQL Database)]
```

### 2. 商業規則引擎 (Utility Logic)
```
[效期追蹤圖層]  Expiry Status: 
  - 剩餘 > 12 個月  ==> 🟢 安全 (SAFE)
  - 6 ~ 12 個月     ==> 🟡 警告 (WARNING)
  - < 6 個月        ==> 🔴 危急 (CRITICAL)

[庫存分析圖層]  Inventory Status:
  - 現存量 >= 安全庫存  ==> 🟢 正常 (NORMAL)
  - 現存量 < 安全庫存   ==> 🟡 低水位 (LOW)
  - 現存量 === 0       ==> 🔴 缺貨 (OUT_OF_STOCK)

[叫貨頻率圖層]  Order Frequency Status:
  - 0 ~ 30 天       ==> 🟢 正常 (NORMAL)
  - 31 ~ 60 天      ==> 🔵 關注 (ATTENTION)
  - 61 ~ 90 天      ==> 🟡 警示 (WARNING)
  - 90 天以上       ==> 🟣 失溫通路 (COLD)
```

---

## 🗄️ 資料模型與 Supabase Schema

### 實體關聯說明 (ERD)
- **`channels` (通路)**：一對多關聯至 `inventory_items`、`visit_records`。
- **`inventory_items` (庫存品項)**：記錄每個通路的現存商品、安全庫存與產品效期。
- **`visit_records` (拜訪紀錄)**：業務每次回訪與巡店的細緻摘要與客情歷程。

SQL Schema 初稿已存於專案內：`supabase/schema.sql`，可直接於 Supabase SQL Editor 中貼上執行：
- 啟用 UUID 自動生成。
- 建立 `channel_status` 列舉類別。
- 建立 `channels`, `inventory_items`, `visit_records` 關聯表，支援 `ON DELETE CASCADE`。
- 針對 `type`, `owner_sales`, `visit_date` 建立效能檢索索引 (Indexes)。
- 設定 `updated_at` 自動更新觸發器 (PostgreSQL Function)。
- 啟用 Row Level Security (RLS) 並預載安全存取政策。

---

## 📂 建議的 Repo 資料夾結構

本專案結構高度遵循 Next.js App Router 的最佳實踐，確保核心邏輯與 UI 高度解耦：

```text
channel-war-map/
├── .github/
│   └── workflows/
│       └── deploy-pages-on-tag.yml  # Tag 觸發 Pages 自動化靜態部署 CI/CD
├── supabase/
│   └── schema.sql                  # Supabase PostgreSQL DDL 建立初稿
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css             # 全域 Tailwind 與 Mapbox 自訂樣式
│   │   ├── layout.tsx              # 側邊欄與頂部導覽列全域佈局
│   │   ├── page.tsx                # 首頁儀表板 (Dashboard)
│   │   ├── map/
│   │   │   └── page.tsx            # 戰術地圖 (多圖層切換、定位、Popover 戰情)
│   │   └── channels/
│   │       ├── page.tsx            # 通路清單管理、新增通路 Modal
│   │       └── [id]/
│   │           └── page.tsx        # 通路詳細頁 (庫存/效期管理、拜訪 Timeline、新增拜訪 Form)
│   ├── components/                 # 未來可抽出的共用 UI 元件
│   ├── data/
│   │   └── mock.ts                 # 本機 MVP 高仿真假資料 (7 大核心通路、完整歷史拜訪)
│   ├── types/
│   │   └── index.ts                # TypeScript 通路/庫存/拜訪/狀態核心型別定義
│   └── utils/
│       └── status.ts               # 獨立的效期、庫存、叫貨、潛力分級評分計算引擎
├── .env.local.example              # 環境變數設定範例
├── next.config.mjs                 # Next.js 配置檔 (支援 GitHub Pages static export)
├── postcss.config.js
├── tailwind.config.ts              # Tailwind CSS 佈局與色彩主題設定
├── tsconfig.json                   # TypeScript 編譯設定 (支援 @/* 路徑別名)
└── package.json                    # 專案套件依賴設定
```

---

## ⚙️ 本機快速開發方式

請確保您的電腦上已安裝 [Node.js (LTS 版本 v18 或 v20+)](https://nodejs.org/)。

### 1. 克隆與安裝
```bash
# 1. 進入您的本機專案目錄
cd channel-war-map

# 2. 安裝所有核心套件與開發依賴 (包含 Mapbox, Tailwind, TypeScript)
npm install
```

### 2. 環境變數設定
在地圖頁面完美呈現真實 Mapbox 底圖，請在專案根目錄建立 `.env.local` 檔案：
```bash
# 複製範例環境變數
cp .env.local.example .env.local
```
編輯 `.env.local` 並填入您的 Mapbox Token：
```text
NEXT_PUBLIC_MAPBOX_TOKEN=您的_MAPBOX_ACCESS_TOKEN
```
> 💡 **提示：**如果您暫時不填寫 Token，系統會自動在「地圖頁面」啟動「Taipei 戰術網格地圖 fallback 模式」，您仍然可以正常測試所有過濾、點選、圖層切換功能！

### 3. 啟動本機開發伺服器
```bash
npm run dev
```
啟動後，請在瀏覽器開啟 [http://localhost:3000](http://localhost:3000) 即可開始操作極速運轉的 MVP 戰情地圖系統。

### 4. 本機靜態匯出測試
```bash
# 執行靜態 HTML 匯出 (會產生 ./out 資料夾)
npm run build
```

---

## 🌐 關於 GitHub Pages 自動化部署說明

當您在 GitHub Repository 設置好設定：
1. 前往 Repo 頁面 -> `Settings` -> `Pages`。
2. 找到 `Build and deployment` -> `Source`，將其切換為 **`GitHub Actions`**。
3. 未來只要您在本機下 tag 並推送，GitHub Actions 就會自動編譯並發佈網站：
```bash
# 本機下版本 Tag (例如 v1.0.0)
git tag v1.0.0

# 推送 Tag 至 GitHub
git push origin v1.0.0
```
> ⚠️ **注意：**如果您的 Mapbox Token 屬於私密資訊，請前往 Repo -> `Settings` -> `Secrets and variables` -> `Actions` 新增一個 Repository Secret，名稱設為 `NEXT_PUBLIC_MAPBOX_TOKEN`，CI/CD 編譯時便會自動將其注入網站中！

---

## 📈 未來 Roadmap 與 SaaS 擴充方向

本 MVP 保留了極佳的架構擴充空間，未來在進入正式商業版與 SaaS 訂閱制時，可規劃以下方向：

1. **Supabase API 實體串接**：
   - 將 `src/data/mock.ts` 置換為 `@supabase/supabase-js` 查詢。
   - 使用 Supabase Auth 進行業務代表登入，並透過 RLS (Row-Level Security) 實現「業務僅能看到自己管轄通路，主管可看全區」的權限隔離。
2. **多租戶 SaaS 隔離 (Multi-Tenant)**：
   - 在 `channels` 與 `users` 資料表加入 `tenant_id`，實現多藥廠/多經銷商獨立租戶訂閱。
3. **ERP / WMS 即時庫存整合**：
   - 開發 Webhook 接收企業內部 ERP (如 SAP, Oracle, 正航) 的叫貨單與進銷存變動，實現在庫庫存的自動化扣減與即時同步。
4. **業務外勤打卡與 LINE 通知**：
   - 整合手機瀏覽器 GPS 定位，點擊「開始拜訪」進行業務簽到打卡，核對與通路經緯度是否在 50 公尺內。
   - 當通路庫存零水位或效期急迫時，自動透過 LINE Notify / Slack 機器人發送通知。
5. **AI 銷量預測與補貨推薦**：
   - 根據歷史叫貨週期與季節銷售曲線，自動推算下一次補貨建議量，並在地圖上將最急需拜訪的通路渲染為閃爍紅圈。

---

## 📄 License

Based on MIT License. Copyright (c) 2026 Channel War Map Team.
