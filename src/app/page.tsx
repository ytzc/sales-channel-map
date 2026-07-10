"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Layers, 
  Database, 
  MapPin, 
  Sparkles, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight,
  CheckCircle2,
  ListFilter,
  Check,
  Server
} from "lucide-react";

type TabType = "general" | "layers" | "schema" | "tech";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-emerald-500 rounded-full opacity-5 blur-3xl"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>互動式產品規格文件 (Interactive PRD)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            🗺️ 通路戰情地圖系統規格書
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
            本系統將地理資訊系統 (GIS) 與輕量 CRM 高度整合，解決「資訊孤島」、「過期損耗」與「巡店效率低」等營運痛點。本頁面將原始需求進行視覺化與結構化整理，協助團隊快速對齊開發範疇。
          </p>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm sticky top-0 z-20">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "general"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="hidden sm:inline">專案目的 & 使用者</span>
          <span className="sm:hidden">目的</span>
        </button>
        <button
          onClick={() => setActiveTab("layers")}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "layers"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">四大戰術地圖圖層</span>
          <span className="sm:hidden">地圖圖層</span>
        </button>
        <button
          onClick={() => setActiveTab("schema")}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "schema"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">資料欄位 & 模型</span>
          <span className="sm:hidden">資料欄位</span>
        </button>
        <button
          onClick={() => setActiveTab("tech")}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "tech"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Server className="w-4 h-4" />
          <span className="hidden sm:inline">架構評估 & 未來規劃</span>
          <span className="sm:hidden">架構規劃</span>
        </button>
      </div>

      {/* Tab Content 1: General & Users */}
      {activeTab === "general" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:border-indigo-100 transition-all">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">🎯</span>
                <span>專案目的與核心解決痛點</span>
              </h2>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  傳統通路管理常面臨資訊孤島（ERP 庫存、Excel 紀錄與 Google Maps 地址分離）、業務巡店效率低、過期損耗高等問題。本系統透過**一秒視覺化地圖**將這些維度完美結合。
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-lg text-center border border-slate-100">
                    <span className="text-2xl">⚡</span>
                    <h4 className="font-bold text-xs text-slate-800 mt-2">提升巡店人效</h4>
                    <p className="text-[10px] text-slate-500 mt-1">規劃最有效率的巡店路線</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-lg text-center border border-slate-100">
                    <span className="text-2xl">📉</span>
                    <h4 className="font-bold text-xs text-slate-800 mt-2">降低效期損耗</h4>
                    <p className="text-[10px] text-slate-500 mt-1">臨期商品警報與提前調轉</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-lg text-center border border-slate-100">
                    <span className="text-2xl">🔥</span>
                    <h4 className="font-bold text-xs text-slate-800 mt-2">減少客戶流失</h4>
                    <p className="text-[10px] text-slate-500 mt-1">偵測失溫通路並自動提醒</p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-lg text-center border border-slate-100">
                    <span className="text-2xl">🌱</span>
                    <h4 className="font-bold text-xs text-slate-800 mt-2">擴張潛力通路</h4>
                    <p className="text-[10px] text-slate-500 mt-1">重點開發與高回購追蹤</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:border-indigo-100 transition-all">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">📊</span>
                <span>首頁儀表板 KPI 指標定義</span>
              </h2>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  系統首頁將即時運算並呈現以下六大關鍵營運數值，做為每日工作起點：
                </p>
                <div className="space-y-2.5">
                  {[
                    { label: "總合作通路數", desc: "目前正在合作中的活躍通路總量", icon: "🏢", color: "border-l-indigo-500" },
                    { label: "待開發通路數", desc: "名單內計畫或正在接洽開發的新據點", icon: "🌱", color: "border-l-emerald-500" },
                    { label: "快過期通路數", desc: "商品最快到期日少於 6 個月的高風險通路", icon: "⏳", color: "border-l-rose-500" },
                    { label: "缺貨通路數", desc: "目前在庫商品數量 = 0 的緊急缺貨通路", icon: "📦", color: "border-l-amber-500" },
                    { label: "失溫通路數", desc: "距離上一次叫貨日已超過 90 天的預警通路", icon: "❄️", color: "border-l-purple-500" },
                    { label: "本月叫貨與排行", desc: "當月叫貨率統計與區域銷售業績分布排行榜", icon: "🏆", color: "border-l-sky-500" },
                  ].map((kpi, idx) => (
                    <div key={idx} className={`flex items-center space-x-3 p-2 bg-slate-50 rounded-lg border-l-4 ${kpi.color} border border-slate-100`}>
                      <span className="text-lg">{kpi.icon}</span>
                      <div>
                        <h4 className="font-semibold text-xs text-slate-800">{kpi.label}</h4>
                        <p className="text-[10px] text-slate-500">{kpi.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Persona Split Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>兩大核心使用者與聚焦痛點</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/20 relative">
                <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded">第一線業務</span>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🧑‍💼</span>
                  <h4 className="font-bold text-slate-900">業務代表 (Sales Representative)</h4>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600 mt-4">
                  <li className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-0.5">🔹</span>
                    <span><strong>巡店效率優化</strong>：不需盲目拜訪，地圖一秒顯示今天最急需補貨或排查效期的店家。</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-0.5">🔹</span>
                    <span><strong>即時客情登錄</strong>：巡店完畢可用平板或手機立即提交拜訪紀錄與下一次待辦。</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-0.5">🔹</span>
                    <span><strong>零過期目標</strong>：透過警示預先知道 6-12 個月的商品，提早安排行銷促銷或調轉。</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/20 relative">
                <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">管理層決策</span>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">👩‍💼</span>
                  <h4 className="font-bold text-slate-900">業務主管 (Sales Manager)</h4>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600 mt-4">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 mt-0.5">🔹</span>
                    <span><strong>區域業績地圖</strong>：迅速分析台北市各行政區（如大安區、信義區）的通路密度與業績。</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 mt-0.5">🔹</span>
                    <span><strong>客情溫度控管</strong>：自動統計流失（失溫）通路比率，評估業務巡店頻率與客情健全度。</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 mt-0.5">🔹</span>
                    <span><strong>潛力分級打分</strong>：自動劃分 A/B/C 等級客戶，針對 A 級大戶提供 VIP 級保護。</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Map Layers */}
      {activeTab === "layers" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex items-center space-x-3">
            <span className="text-2xl">💡</span>
            <p className="text-xs text-slate-600">
              地圖標記 (Marker) 的顏色將會隨著目前選取的「戰術圖層」與「商業規則計算」動態渲染，確保業務能一鍵切換視角。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Layer 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <span className="text-xl">🏪</span>
                  <span>1. 營運通路狀態圖層 (預設)</span>
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">基礎圖層</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                顯示通路的當前合作進度與開展關係，適用於通路普查與新點開發定位。
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 inline-block"></span>
                  <span className="text-xs text-slate-700 font-medium">🔵 合作通路</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 inline-block"></span>
                  <span className="text-xs text-slate-700 font-medium">🟡 洽談中</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-xs text-slate-700 font-medium">🟢 待開發</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block"></span>
                  <span className="text-xs text-slate-700 font-medium">🔴 終止合作</span>
                </div>
              </div>
            </div>

            {/* Layer 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <span className="text-xl">📦</span>
                  <span>2. 庫存分析圖層 (補貨地圖)</span>
                </h3>
                <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200/50 px-2 py-0.5 rounded-full">補貨決策</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                比對「在庫總數」與每個店自訂的「安全庫存水位」，實現精準配送。
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-emerald-50/50 rounded border border-emerald-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-xs text-slate-700 font-medium">🟢 庫存正常</span>
                  </div>
                  <span className="text-[10px] text-slate-500">庫存量 &ge; 安全水位</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50/50 rounded border border-yellow-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 inline-block"></span>
                    <span className="text-xs text-slate-700 font-medium">🟡 低於安全水位</span>
                  </div>
                  <span className="text-[10px] text-slate-500">庫存量 &lt; 安全水位</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-rose-50/50 rounded border border-rose-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-600 inline-block"></span>
                    <span className="text-xs text-slate-700 font-medium">🔴 緊急缺貨</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold text-rose-600">在庫量 = 0 (優先拜訪)</span>
                </div>
              </div>
            </div>

            {/* Layer 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <span className="text-xl">⏳</span>
                  <span>3. 效期追蹤圖層 (防損地圖)</span>
                </h3>
                <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200/50 px-2 py-0.5 rounded-full">過期防損</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                運算通路所有庫存中「效期最迫切商品」的賸餘到期月份，提早進行調換或促銷。
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-emerald-50/50 rounded border border-emerald-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-xs text-slate-700 font-medium">🟢 安全</span>
                  </div>
                  <span className="text-[10px] text-slate-500">剩餘效期 &gt; 12 個月</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50/50 rounded border border-yellow-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 inline-block"></span>
                    <span className="text-xs text-slate-700 font-medium">🟡 臨期警告</span>
                  </div>
                  <span className="text-[10px] text-slate-500">剩餘效期 6 ~ 12 個月</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-rose-50/50 rounded border border-rose-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-600 inline-block"></span>
                    <span className="text-xs text-slate-700 font-medium">🔴 急迫過期</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold text-rose-600">剩餘效期 &lt; 6 個月 (立即處理)</span>
                </div>
              </div>
            </div>

            {/* Layer 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <span className="text-xl">❄️</span>
                  <span>4. 叫貨頻率圖層 (溫度預警)</span>
                </h3>
                <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-200/50 px-2 py-0.5 rounded-full">客情防禦</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                自動運算「今日日期」減去「最後叫貨日」的天數差距，掌握店家回購活躍度。
              </p>
              <div className="space-y-1.5">
                {[
                  { range: "0 ~ 30 天", label: "正常熱絡", color: "bg-emerald-500", desc: "回購頻率符合標準" },
                  { range: "31 ~ 60 天", label: "需加強關注", color: "bg-blue-500", desc: "叫貨間隔稍有拉長" },
                  { range: "61 ~ 90 天", label: "警示回訪", color: "bg-yellow-500", desc: "可能遭到同業競爭" },
                  { range: "90 天以上", label: "預警失溫", color: "bg-purple-600", desc: "客戶面臨流失 (高危急)" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3.5 h-3.5 rounded-full ${item.color} inline-block`}></span>
                      <span className="text-xs text-slate-700 font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-[10px] text-slate-400">{item.desc}</span>
                      <span className="text-[10px] font-semibold text-slate-600">{item.range}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Schema & Data Model */}
      {activeTab === "schema" && (
        <div className="space-y-8 animate-fadeIn">
          {/* channels table schema */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <span>1. 通路主表資料庫結構 (`channels`)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">儲存通路的基础維度、經緯度坐標及客戶類型與負責人資訊</p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded font-mono font-semibold">PostgreSQL</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="p-4 w-1/4">欄位名稱 (Column Name)</th>
                    <th className="p-4 w-1/5">型別 (Type)</th>
                    <th className="p-4 w-1/6">範疇 / 範例</th>
                    <th className="p-4">描述與說明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {[
                    { name: "id", type: "UUID (Primary Key)", val: "自動生成", desc: "通路唯一識別代碼" },
                    { name: "name", type: "VARCHAR", val: "健康人生藥局", desc: "藥局、診所或客戶名稱" },
                    { name: "type", type: "VARCHAR", val: "合作中 / 洽談中 / 待開發", desc: "通路的商業合作狀態圖層基準" },
                    { name: "potential_level", type: "VARCHAR", val: "A / B / C", desc: "經系統打分評估後的通路潛力分級" },
                    { name: "address", type: "VARCHAR", val: "台北市大安區新生南路...", desc: "用於顯示與進行地理反查的地址" },
                    { name: "latitude", type: "DECIMAL", val: "25.0345", desc: "地圖標記定位 Y 坐標 (經度)" },
                    { name: "longitude", type: "DECIMAL", val: "121.5362", desc: "地圖標記定位 X 坐標 (緯度)" },
                    { name: "contact_person", type: "VARCHAR", val: "王大同", desc: "通路的主管、採購或店長姓名" },
                    { name: "phone", type: "VARCHAR", val: "02-2365-XXXX", desc: "通路聯絡電話" },
                    { name: "owner_sales", type: "VARCHAR", val: "Jerry Chen", desc: "負責維護此通路的本公司業務代表" },
                    { name: "cooperate_start_date", type: "DATE", val: "2026-01-10", desc: "合約正式啟動或開展往來日期" },
                    { name: "remarks", type: "TEXT", val: "店面較小，適合主力促銷商品A", desc: "客情備忘錄與補充說明" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-semibold text-indigo-600">{row.name}</td>
                      <td className="p-4 font-mono text-slate-500">{row.type}</td>
                      <td className="p-4 text-slate-600">{row.val}</td>
                      <td className="p-4 text-slate-500">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* inventory table schema */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2 text-sm">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>2. 庫存與品項表 (`inventory_items`)</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100/50 border-b border-slate-200 text-[10px] font-semibold text-slate-600">
                    <tr>
                      <th className="p-3">欄位</th>
                      <th className="p-3">型別</th>
                      <th className="p-3">描述</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "id", type: "UUID (PK)", desc: "唯一識別代碼" },
                      { name: "channel_id", type: "UUID (FK)", desc: "外鍵，關聯至 `channels.id` (一對多)" },
                      { name: "product_name", type: "VARCHAR", desc: "商品名稱 (如：成人奶粉, 葉黃素)" },
                      { name: "current_stock", type: "INTEGER", desc: "店家當前實際庫存量" },
                      { name: "safety_stock", type: "INTEGER", desc: "店家自訂安全水位 (低於此數警報)" },
                      { name: "expiry_date", type: "DATE", desc: "商品到期日 (效期圖層運算來源)" },
                      { name: "last_updated", type: "DATE", desc: "上一次實地盤點/登入時間" },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30">
                        <td className="p-3 font-mono font-semibold text-indigo-600">{row.name}</td>
                        <td className="p-3 font-mono text-slate-500">{row.type}</td>
                        <td className="p-3 text-slate-500">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* visit_records table schema */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2 text-sm">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>3. 業務拜訪紀錄表 (`visit_records`)</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100/50 border-b border-slate-200 text-[10px] font-semibold text-slate-600">
                    <tr>
                      <th className="p-3">欄位</th>
                      <th className="p-3">型別</th>
                      <th className="p-3">描述</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "id", type: "UUID (PK)", desc: "唯一識別代碼" },
                      { name: "channel_id", type: "UUID (FK)", desc: "外鍵，關聯至 `channels.id` (一對多)" },
                      { name: "visit_date", type: "DATE", desc: "業務實地或線上拜訪的日期" },
                      { name: "visitor", type: "VARCHAR", desc: "進行拜訪的業務姓名" },
                      { name: "summary", type: "TEXT", desc: "拜訪客情與重要記事內容" },
                      { name: "todo_items", type: "TEXT", desc: "後續待辦事項 (如：下週補叫維他命)" },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30">
                        <td className="p-3 font-mono font-semibold text-indigo-600">{row.name}</td>
                        <td className="p-3 font-mono text-slate-500">{row.type}</td>
                        <td className="p-3 text-slate-500">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Tech Stack & Roadmap */}
      {activeTab === "tech" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Tech stack reasons */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center space-x-2">
              <Server className="w-5 h-5 text-indigo-600" />
              <span>一、 技術架構選擇評估與建議</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-indigo-600 text-lg">⚡</span>
                  <h4 className="font-bold text-slate-800 text-sm">Next.js 14+ (App Router)</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  具備 React Server Components (RSC) 架構，前端載入極速。內建 API Routes，可用最乾淨、前後端整合的形式開發，不需維護大型獨立後端。
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-indigo-600 text-lg">🔋</span>
                  <h4 className="font-bold text-slate-800 text-sm">Supabase (PostgreSQL)</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  提供雲端 PostgreSQL，內建 RLS 權限管理政策，極度適合未來轉為多租戶 (Multi-Tenant) 的 SaaS 擴充。提供免寫後端的 Client 查詢庫，加速產品開發 3 倍。
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-indigo-600 text-lg">🌍</span>
                  <h4 className="font-bold text-slate-800 text-sm">Mapbox GL JS</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Web-GL 高效能地圖。渲染多點（破千、破萬個地圖點標記）時比 Google Maps 滑順、不卡頓。且可以完全自由地自訂地圖配色，極具科技感與商業美學。
                </p>
              </div>
            </div>
          </div>

          {/* Roadmap steps */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>二、 未來 Roadmap 與 SaaS 擴充路徑</span>
            </h3>

            <div className="relative border-l border-slate-200 ml-4 pl-8 space-y-8">
              {[
                {
                  phase: "階段一：MVP 基礎功能實作 (當前版本)",
                  status: "100% 已就緒",
                  color: "bg-emerald-500 border-emerald-100",
                  textColor: "text-emerald-600 bg-emerald-50",
                  items: [
                    "本機獨立運行，免去繁複的 ERP 對接",
                    "建立「首頁 Dashboard」即時戰情中心",
                    "地圖 4 大核心主題圖層切換 (狀態、庫存、效期、叫貨頻率)",
                    "Taipei 地圖 fallback 機制，保證 100% 隨開即測",
                    "通路新增與今日拜訪紀錄動態更新實踐"
                  ]
                },
                {
                  phase: "階段二：Supabase 雲端資料庫串接與權限機制",
                  status: "即將開展",
                  color: "bg-indigo-600 border-indigo-100",
                  textColor: "text-indigo-600 bg-indigo-50",
                  items: [
                    "建立 Supabase 實體資料庫，轉換 Mock Data 為即時 PostgreSQL 查詢",
                    "建立 Supabase Auth 登入：導入 RLS 權限政策，業務「僅能查看與編輯自轄通路」，主管可看「全區數據」",
                    "建立業務巡店拜訪時的「手機 GPS 打卡功能」，確認是否實際到達通路 100 公尺內"
                  ]
                },
                {
                  phase: "階段三：SaaS 多租戶與外部系統 (ERP/WMS) 串接",
                  status: "規劃中",
                  color: "bg-slate-400 border-slate-100",
                  textColor: "text-slate-500 bg-slate-100",
                  items: [
                    "資料庫底層加入 `tenant_id`，實現「多廠商、多藥廠獨立訂閱」之 SaaS 平台架構",
                    "建立 REST API / Webhook，接收企業內部 ERP 的叫貨單，達成庫存與銷量的全自動扣減與同步",
                    "LINE Notify / Slack 串接：通路若庫存為零或效期告急，自動推播至業務的 LINE 進行補貨催單"
                  ]
                }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Point */}
                  <span className={`absolute -left-12 top-1.5 w-8 h-8 rounded-full ${step.color} border-4 flex items-center justify-center text-white text-xs font-bold`}>
                    {idx + 1}
                  </span>
                  
                  {/* Card */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{step.phase}</h4>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-self-start ${step.textColor}`}>
                        {step.status}
                      </span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-500 list-disc pl-4 leading-relaxed">
                      {step.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
