"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockChannels } from '@/data/mock';
import { Channel, VisitRecord } from '@/types';
import { 
  getInventoryStatus, 
  getExpiryStatus,
  getChannelOverallInventoryStatus, 
  getChannelOverallExpiryStatus, 
  getOrderFrequencyStatus, 
  getPotentialGrade,
  getDaysDifference,
  parseDate
} from '@/utils/status';

export default function ChannelDetailPage({ params }: { params: { id: string } }) {
  const referenceDate = new Date('2026-07-10');
  const channelId = params.id;

  // Find channel from mock data
  const baseChannel = useMemo(() => {
    return mockChannels.find(c => c.id === channelId) || null;
  }, [channelId]);

  // Handle local state for the channel to allow adding dynamic visit records instantly
  const [channel, setChannel] = useState<Channel | null>(baseChannel);
  const [activeTab, setActiveTab] = useState<'inventory' | 'visits'>('inventory');

  // Visit Record form state
  const [visitDate, setVisitDate] = useState('2026-07-10');
  const [visitor, setVisitor] = useState('Jerry Chen');
  const [purpose, setPurpose] = useState('定期拜訪與庫存盤點');
  const [visitNotes, setVisitNotes] = useState('');

  // Handle adding a new visit record
  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channel) return;
    if (!visitNotes) {
      alert("請輸入拜訪記事備忘！");
      return;
    }

    const newRecord: VisitRecord = {
      id: `v-generated-${Date.now()}`,
      visitDate,
      visitor,
      purpose,
      notes: visitNotes
    };

    const updatedChannel: Channel = {
      ...channel,
      visitRecords: [newRecord, ...channel.visitRecords]
    };

    setChannel(updatedChannel);
    // Reset form
    setVisitNotes('');
    alert("拜訪紀錄已成功登錄至本機記憶體！");
  };

  if (!channel) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 max-w-xl mx-auto shadow-sm my-12 space-y-4">
        <span className="text-4xl block">🔍</span>
        <h3 className="text-xl font-bold text-slate-800">未找到通路資料</h3>
        <p className="text-sm text-slate-500">此通路 ID 在系統中不存在或已被移除。</p>
        <Link href="/channels" className="text-indigo-600 hover:underline font-bold text-sm block">
          ← 返回通路清單管理
        </Link>
      </div>
    );
  }

  // Calculate statuses
  const invStatus = getChannelOverallInventoryStatus(channel.inventoryItems);
  const expStatus = getChannelOverallExpiryStatus(channel.inventoryItems, referenceDate);
  const freqStatus = getOrderFrequencyStatus(channel.lastOrderDate, referenceDate);
  const grade = getPotentialGrade(channel, referenceDate);

  // Growth rate arrow and text
  const growthElement = channel.yearlyGrowthRate > 0 ? (
    <span className="text-emerald-600 font-bold">↑ {(channel.yearlyGrowthRate * 100).toFixed(0)}% 成長</span>
  ) : channel.yearlyGrowthRate < 0 ? (
    <span className="text-red-500 font-bold">↓ {Math.abs(channel.yearlyGrowthRate * 100).toFixed(0)}% 衰退</span>
  ) : (
    <span className="text-slate-500">無成長變化</span>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back button and title */}
      <div>
        <Link href="/channels" className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center space-x-1.5 mb-2">
          <span>←</span>
          <span>返回通路清單管理</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{channel.name}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${channel.type === 'partner' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : channel.type === 'negotiating' ? 'bg-amber-100 text-amber-800 border border-amber-200' : channel.type === 'prospect' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                {channel.type === 'partner' ? '合作通路' : channel.type === 'negotiating' ? '洽談中' : channel.type === 'prospect' ? '待開發' : '停止合作'}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs border border-emerald-100 font-extrabold">
                {grade} 級潛力
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <span>📍 {channel.address}</span>
              <span className="text-slate-300">|</span>
              <span>📞 {channel.phone}</span>
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            ⏰ 開啟合作日：{channel.startDate}
          </div>
        </div>
      </div>

      {/* Main Grid: Left side details, Right side tabbed tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Information and Potential grade calculator breakdown */}
        <div className="space-y-6">
          {/* Channel Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4 text-sm uppercase tracking-wider text-slate-400">
              🏪 通路基本檔案
            </h3>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                <div>
                  <p className="text-slate-400">主要聯絡窗口</p>
                  <p className="font-bold text-slate-800 mt-1 text-sm">{channel.contactName}</p>
                </div>
                <div>
                  <p className="text-slate-400">負責業務代表</p>
                  <p className="font-bold text-slate-800 mt-1 text-sm">{channel.ownerSales}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                <div>
                  <p className="text-slate-400">月平均銷售金額</p>
                  <p className="font-bold text-slate-800 mt-1 text-sm">${channel.monthlySales.toLocaleString()} NTD</p>
                </div>
                <div>
                  <p className="text-slate-400">年銷量成長率</p>
                  <p className="font-bold text-slate-800 mt-1 text-sm">{growthElement}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 mb-1.5">通路背景與合作特點</p>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-600 leading-relaxed italic">
                  &ldquo;{channel.notes}&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* Operational Status breakdown (戰情儀表盤) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4 text-sm uppercase tracking-wider text-slate-400">
              📊 通路戰事狀態解讀
            </h3>
            <div className="space-y-3.5 text-xs">
              {/* Inventory overall */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-500">庫存現狀圖層評級</span>
                {invStatus === 'NORMAL' && <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">🟢 正常庫存</span>}
                {invStatus === 'LOW' && <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-100 font-bold">🟡 庫存緊繃</span>}
                {invStatus === 'OUT_OF_STOCK' && <span className="px-2 py-1 rounded bg-red-50 text-red-700 border border-red-100 font-bold animate-pulse">🔴 零庫存缺貨</span>}
              </div>

              {/* Expiry overall */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-500">剩餘效期圖層評級</span>
                {expStatus === 'SAFE' && <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">🟢 效期安全</span>}
                {expStatus === 'WARNING' && <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-100 font-bold">🟡 警告 (6-12m)</span>}
                {expStatus === 'CRITICAL' && <span className="px-2 py-1 rounded bg-red-50 text-red-700 border border-red-100 font-bold animate-pulse">🔴 臨期過期</span>}
              </div>

              {/* Frequency overall */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-500">回購補貨週期評級</span>
                {freqStatus === 'NORMAL' && <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">🟢 叫貨積極</span>}
                {freqStatus === 'ATTENTION' && <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold">🔵 開始關注</span>}
                {freqStatus === 'WARNING' && <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-100 font-bold">🟡 預警流失</span>}
                {freqStatus === 'COLD' && <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-100 font-bold">🟣 失溫通路</span>}
              </div>

              {/* Potential grade calculation card logic display */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5 mt-2 text-[11px] text-slate-500">
                <p className="font-bold text-slate-700 mb-1">🎯 潛力評級（{grade} 級）計算詳情：</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>成長分：{channel.yearlyGrowthRate >= 0.15 ? "3 / 3 (大於15%高成長)" : channel.yearlyGrowthRate >= 0 ? "2 / 3 (平穩成長)" : "1 / 3 (負成長)"}</li>
                  <li>回購分：{getDaysDifference(parseDate(channel.lastOrderDate), referenceDate) <= 30 ? "3 / 3 (30天內回購)" : getDaysDifference(parseDate(channel.lastOrderDate), referenceDate) <= 90 ? "2 / 3 (90天內回購)" : "1 / 3 (冷淡)"}</li>
                  <li>銷售分：{channel.monthlySales >= 100000 ? "3 / 3 (大於10萬高營收)" : channel.monthlySales >= 30000 ? "2 / 3 (中等營收)" : "1 / 3 (低營收)"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Area (Inventory vs Visits) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab buttons */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 py-4 text-xs font-bold border-r border-slate-200 transition-all flex items-center justify-center space-x-2 ${activeTab === 'inventory' ? 'bg-white text-indigo-700 border-t-2 border-t-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
              >
                <span>📦</span>
                <span>商品庫存與效期管理 ({channel.inventoryItems.length})</span>
              </button>
              <button 
                onClick={() => setActiveTab('visits')}
                className={`flex-1 py-4 text-xs font-bold transition-all flex items-center justify-center space-x-2 ${activeTab === 'visits' ? 'bg-white text-indigo-700 border-t-2 border-t-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
              >
                <span>📝</span>
                <span>業務拜訪紀錄與客情歷程 ({channel.visitRecords.length})</span>
              </button>
            </div>

            {/* TAB CONTENT: INVENTORY */}
            {activeTab === 'inventory' && (
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">在庫庫存產品列表 (假資料 Mock Data)</h4>
                  <p className="text-[10px] text-slate-400">最後叫貨日：{channel.lastOrderDate === '2026-07-10' && channel.productCount === 0 ? "尚未叫貨" : channel.lastOrderDate}</p>
                </div>

                {channel.inventoryItems.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    目前此通路沒有任何在庫庫存紀錄，請先洽談上架。
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3">產品名稱</th>
                          <th className="p-3 text-center">現有庫存</th>
                          <th className="p-3 text-center">安全庫存</th>
                          <th className="p-3">庫存狀態</th>
                          <th className="p-3">產品到期日</th>
                          <th className="p-3">剩餘效期評級</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channel.inventoryItems.map((item, idx) => {
                          const itemInvStatus = getInventoryStatus(item);
                          const itemExpStatus = getExpiryStatus(item.expiryDate, referenceDate);

                          return (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                              <td className="p-3 font-bold text-slate-800">{item.productName}</td>
                              <td className="p-3 text-center font-semibold text-slate-700">{item.quantity}</td>
                              <td className="p-3 text-center text-slate-500">{item.safetyStock}</td>
                              
                              {/* Stock status tag */}
                              <td className="p-3">
                                {itemInvStatus === 'NORMAL' && <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold text-[10px]">庫存充足</span>}
                                {itemInvStatus === 'LOW' && <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-semibold text-[10px]">低於水位</span>}
                                {itemInvStatus === 'OUT_OF_STOCK' && <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-100 font-bold text-[10px] animate-pulse">零庫存</span>}
                              </td>

                              <td className="p-3 font-medium text-slate-600">{item.expiryDate}</td>

                              {/* Expiry status tag */}
                              <td className="p-3">
                                {itemExpStatus === 'SAFE' && <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold text-[10px]">安全 (&gt;12m)</span>}
                                {itemExpStatus === 'WARNING' && <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-semibold text-[10px]">警戒 (6-12m)</span>}
                                {itemExpStatus === 'CRITICAL' && <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-100 font-bold text-[10px]">急迫 (&lt;6m)</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: VISITS */}
            {activeTab === 'visits' && (
              <div className="p-6 space-y-6">
                
                {/* Add Visit Record Form */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">🖊️ 登錄今日業務拜訪活動記事</h4>
                  <form onSubmit={handleAddVisit} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold mb-1 block">拜訪日期</label>
                        <input 
                          type="date" 
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold mb-1 block">拜訪人 / Sales</label>
                        <input 
                          type="text" 
                          value={visitor}
                          onChange={(e) => setVisitor(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold mb-1 block">拜訪目的</label>
                        <select 
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
                        >
                          <option value="定期拜訪與庫存盤點">定期拜訪與庫存盤點</option>
                          <option value="合約議定與進架爭取">合約議定與進架爭取</option>
                          <option value="新品展示與樣品提供">新品展示與樣品提供</option>
                          <option value="客訴處理與售後維繫">客訴處理與售後維繫</option>
                          <option value="客情與佳節問候">客情與佳節問候</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold mb-1 block">拜訪詳細紀要</label>
                      <textarea 
                        rows={3}
                        required
                        placeholder="請詳細記錄本次拜訪中，藥師/店長的反饋、庫存核對情況、競品動態，以及下一次預定跟進的待辦工作..."
                        value={visitNotes}
                        onChange={(e) => setVisitNotes(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-[11px] shadow hover:shadow-md transition-all"
                      >
                        新增此筆拜訪紀錄
                      </button>
                    </div>
                  </form>
                </div>

                {/* Visit Records List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">歷史拜訪紀錄時間軸 (Visit Logs)</h4>
                  
                  {channel.visitRecords.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">此通路目前尚無任何拜訪紀錄，請新增第一筆拜訪紀錄以利客情追蹤。</p>
                  ) : (
                    <div className="relative border-l border-slate-200 pl-4 space-y-4 ml-2">
                      {channel.visitRecords.map((record, rIdx) => (
                        <div key={record.id} className="relative space-y-1 bg-slate-50/50 hover:bg-slate-50 p-3.5 rounded-lg border border-slate-100 transition-colors">
                          {/* Dot on timeline */}
                          <span className="absolute -left-[21px] top-4 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white"></span>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 font-semibold gap-1">
                            <span className="text-slate-500 font-bold text-xs">{record.visitor}</span>
                            <span>📅 拜訪日：{record.visitDate}</span>
                          </div>
                          <p className="text-indigo-600 font-bold text-xs">目的：{record.purpose}</p>
                          <p className="text-xs text-slate-600 leading-relaxed mt-1 bg-white p-2.5 rounded border border-slate-100/60 font-mono">
                            {record.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
