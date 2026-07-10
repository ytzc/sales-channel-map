import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "通路戰情地圖系統 - Channel War Map",
  description: "整合通路位置、庫存、效期、叫貨頻率與拜訪紀錄的地圖式 CRM / 營運儀表板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="bg-slate-50 min-h-screen flex flex-col md:flex-row text-slate-800">
        {/* Sidebar Container */}
        <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col border-r border-slate-800">
          {/* Logo / Title */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
              戰
            </div>
            <div>
              <h1 className="font-bold text-md leading-tight tracking-wide">通路戰情地圖</h1>
              <p className="text-xs text-slate-400">Channel War Map</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1">
            <Link 
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white animate-pulse border border-indigo-500/10 bg-indigo-500/5 hover:bg-slate-800"
            >
              <span>📋</span>
              <span>需求與架構文件</span>
            </Link>
            <Link 
              href="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <span>📊</span>
              <span>首頁儀表板</span>
            </Link>
            <Link 
              href="/map"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <span>🗺️</span>
              <span>通路地圖頁面</span>
            </Link>
            <Link 
              href="/channels"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <span>🏪</span>
              <span>通路清單管理</span>
            </Link>
          </nav>

          {/* User/Sales Info footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-semibold text-white">
                JC
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Jerry Chen</p>
                <p className="text-[10px] text-slate-400">資深業務代表</p>
              </div>
            </div>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-emerald-400 border border-emerald-500/20">
              在線
            </span>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                MVP 測試版
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">|</span>
              <span className="text-slate-500 text-xs hidden sm:inline">今日基準日：2026 年 7 月 10 日</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-slate-500 hover:text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                🔍 搜尋通路
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm cursor-pointer hover:bg-slate-200">
                🔔
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
