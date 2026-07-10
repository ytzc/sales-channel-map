"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockChannels } from '@/data/mock';
import { 
  getChannelOverallInventoryStatus, 
  getChannelOverallExpiryStatus, 
  getOrderFrequencyStatus, 
  getPotentialGrade,
  getDaysDifference,
  parseDate
} from '@/utils/status';

export default function DashboardPage() {
  const referenceDate = new Date('2026-07-10');

  // 1. Calculate Statistics dynamically from mock data
  const stats = useMemo(() => {
    let totalChannels = mockChannels.length;
    let partnerCount = 0;
    let negotiatingCount = 0;
    let prospectCount = 0;
    let suspendedCount = 0;

    let outOfStockCount = 0; // channels with out of stock items
    let lowStockCount = 0; // channels with low stock but no out of stock
    let criticalExpiryCount = 0; // channels with items expiring < 6m
    let warningExpiryCount = 0; // channels with items expiring 6-12m
    let coldOrderCount = 0; // channels with last order > 90 days
    let warningOrderCount = 0; // channels with last order 61-90 days

    let gradeACount = 0;
    let gradeBCount = 0;
    let gradeCCount = 0;

    const criticalExpiryItems: Array<{ channelName: string; productName: string; expiryDate: string }> = [];
    const outOfStockItems: Array<{ channelName: string; productName: string; quantity: number }> = [];
    const urgentVisits: Array<{ channelId: string; channelName: string; daysSinceLastOrder: number; phone: string }> = [];

    mockChannels.forEach(channel => {
      // Count channel types
      if (channel.type === 'partner') partnerCount++;
      else if (channel.type === 'negotiating') negotiatingCount++;
      else if (channel.type === 'prospect') prospectCount++;
      else if (channel.type === 'suspended') suspendedCount++;

      // Inventory Overall
      const invStatus = getChannelOverallInventoryStatus(channel.inventoryItems);
      if (invStatus === 'OUT_OF_STOCK') outOfStockCount++;
      else if (invStatus === 'LOW') lowStockCount++;

      // Expiry Overall
      const expStatus = getChannelOverallExpiryStatus(channel.inventoryItems, referenceDate);
      if (expStatus === 'CRITICAL') criticalExpiryCount++;
      else if (expStatus === 'WARNING') warningExpiryCount++;

      // Order frequency Overall
      const orderStatus = getOrderFrequencyStatus(channel.lastOrderDate, referenceDate);
      if (orderStatus === 'COLD') coldOrderCount++;
      else if (orderStatus === 'WARNING') warningOrderCount++;

      // Potential Grade Overall
      const grade = getPotentialGrade(channel, referenceDate);
      if (grade === 'A') gradeACount++;
      else if (grade === 'B') gradeBCount++;
      else if (grade === 'C') gradeCCount++;

      // Collect specific items for alerts
      channel.inventoryItems.forEach(item => {
        if (item.quantity === 0) {
          outOfStockItems.push({
            channelName: channel.name,
            productName: item.productName,
            quantity: item.quantity
          });
        }
        const mDiff = Math.floor(getDaysDifference(referenceDate, parseDate(item.expiryDate)) / 30);
        if (mDiff < 6) {
          criticalExpiryItems.push({
            channelName: channel.name,
            productName: item.productName,
            expiryDate: item.expiryDate
          });
        }
      });

      // Collect urgent follow-ups (partner channels with last order > 60 days)
      if (channel.type === 'partner') {
        const days = getDaysDifference(parseDate(channel.lastOrderDate), referenceDate);
        if (days > 60) {
          urgentVisits.push({
            channelId: channel.id,
            channelName: channel.name,
            daysSinceLastOrder: days,
            phone: channel.phone
          });
        }
      }
    });

    // All visit records flat, sorted by date desc
    const recentVisits = mockChannels
      .flatMap(ch => ch.visitRecords.map(vr => ({ ...vr, channelName: ch.name, channelId: ch.id })))
      .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
      .slice(0, 5);

    return {
      totalChannels,
      partnerCount,
      negotiatingCount,
      prospectCount,
      suspendedCount,
      outOfStockCount,
      lowStockCount,
      criticalExpiryCount,
      warningExpiryCount,
      coldOrderCount,
      warningOrderCount,
      gradeACount,
      gradeBCount,
      gradeCCount,
      outOfStockItems: outOfStockItems.slice(0, 4),
      criticalExpiryItems: criticalExpiryItems.slice(0, 4),
      urgentVisits: urgentVisits.sort((a, b) => b.daysSinceLastOrder - a.daysSinceLastOrder),
      recentVisits
    };
  }, [referenceDate]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            歡迎回來，Jerry！👋
          </h2>
          <p className="text-indigo-200 text-sm md:text-base max-w-xl">
            本機 MVP 系統已成功初始化！您共有 <span className="font-bold text-white underline decoration-amber-400 decoration-2">{stats.partnerCount}</span> 間合作通路需要維護，其中有 <span className="font-bold text-red-400">{stats.outOfStockCount}</span> 間通路面臨缺貨，請立即制定拜訪與補貨計劃。
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex space-x-3">
          <Link href="/map" className="px-5 py-3 rounded-xl bg-white text-indigo-900 font-bold hover:bg-slate-100 transition-all text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl">
            <span>🗺️</span>
            <span>查看戰情地圖</span>
          </Link>
          <Link href="/channels" className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all text-sm border border-indigo-500/20 flex items-center space-x-2 shadow-lg hover:shadow-xl">
            <span>➕</span>
            <span>新增/管理通路</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total channels */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">總管轄通路數</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900">{stats.totalChannels} 家</h3>
            <div className="text-xs text-slate-500 mt-2 flex items-center space-x-1.5">
              <span className="text-indigo-600 font-semibold">{stats.partnerCount} 合作中</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold">{stats.negotiatingCount} 洽談</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
            🏪
          </div>
        </div>

        {/* Stock status */}
        <div className={`bg-white rounded-xl p-6 border shadow-sm flex items-center justify-between ${stats.outOfStockCount > 0 ? 'border-red-200 bg-red-50/10' : 'border-slate-200'}`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">庫存狀態異常</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900">{stats.outOfStockCount + stats.lowStockCount} 家</h3>
            <div className="text-xs text-slate-500 mt-2 flex items-center space-x-1.5">
              <span className="text-red-600 font-semibold">🟥 {stats.outOfStockCount} 無庫存</span>
              <span>•</span>
              <span className="text-amber-500 font-semibold">🟨 {stats.lowStockCount} 低安全</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
            📦
          </div>
        </div>

        {/* Expiry status */}
        <div className={`bg-white rounded-xl p-6 border shadow-sm flex items-center justify-between ${stats.criticalExpiryCount > 0 ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200'}`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">產品效期告警</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900">{stats.criticalExpiryCount + stats.warningExpiryCount} 家</h3>
            <div className="text-xs text-slate-500 mt-2 flex items-center space-x-1.5">
              <span className="text-red-500 font-semibold">🟥 {stats.criticalExpiryCount} 臨期(&lt;6m)</span>
              <span>•</span>
              <span className="text-amber-500 font-semibold">🟨 {stats.warningExpiryCount} 警戒</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
            ⏳
          </div>
        </div>

        {/* Order Frequency status */}
        <div className={`bg-white rounded-xl p-6 border shadow-sm flex items-center justify-between ${stats.coldOrderCount > 0 ? 'border-orange-200 bg-orange-50/10' : 'border-slate-200'}`}>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">太久未叫貨 (流失風險)</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900">{stats.coldOrderCount + stats.warningOrderCount} 家</h3>
            <div className="text-xs text-slate-500 mt-2 flex items-center space-x-1.5">
              <span className="text-red-600 font-semibold">🟥 {stats.coldOrderCount} 凍結(&gt;90d)</span>
              <span>•</span>
              <span className="text-amber-500 font-semibold">🟨 {stats.warningOrderCount} 關注</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">
            ❄️
          </div>
        </div>
      </div>

      {/* Main Grid for lists and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column (2 cols in large) - Alerts and Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Alerts Center */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-md font-bold text-slate-900 flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
              <span className="text-red-500">🚨</span>
              <span>即時系統告警中心 (本機運算)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Out of Stock Alert List */}
              <div className="border border-red-100 rounded-lg p-4 bg-red-50/5">
                <h5 className="text-xs font-bold text-red-700 flex items-center space-x-1.5 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                  <span>零庫存告警 (急需補貨)</span>
                </h5>
                {stats.outOfStockItems.length === 0 ? (
                  <p className="text-xs text-slate-400">目前無缺貨品項。</p>
                ) : (
                  <ul className="space-y-2">
                    {stats.outOfStockItems.map((item, idx) => (
                      <li key={idx} className="text-xs flex flex-col sm:flex-row sm:justify-between border-b border-dashed border-red-100 pb-1.5 last:border-0 last:pb-0">
                        <span className="font-semibold text-slate-800">{item.channelName}</span>
                        <span className="text-red-600 font-medium">{item.productName} (0)</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Expiry Alert List */}
              <div className="border border-amber-100 rounded-lg p-4 bg-amber-50/5">
                <h5 className="text-xs font-bold text-amber-700 flex items-center space-x-1.5 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                  <span>低效期告警 (&lt;6個月效期)</span>
                </h5>
                {stats.criticalExpiryItems.length === 0 ? (
                  <p className="text-xs text-slate-400">目前無效期告警品項。</p>
                ) : (
                  <ul className="space-y-2">
                    {stats.criticalExpiryItems.map((item, idx) => (
                      <li key={idx} className="text-xs flex flex-col sm:flex-row sm:justify-between border-b border-dashed border-amber-100 pb-1.5 last:border-0 last:pb-0">
                        <span className="font-semibold text-slate-800">{item.channelName}</span>
                        <span className="text-amber-600 font-medium">{item.productName} ({item.expiryDate})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Urgent Follow Up Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-md font-bold text-slate-900 flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
              <span className="text-amber-500">📅</span>
              <span>本月建議拜訪與回訪清單</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3">通路名稱</th>
                    <th className="p-3">最後叫貨日</th>
                    <th className="p-3">未叫貨天數</th>
                    <th className="p-3">聯絡電話</th>
                    <th className="p-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.urgentVisits.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-slate-400">所有通路回購規律良好！</td>
                    </tr>
                  ) : (
                    stats.urgentVisits.map((item, idx) => {
                      const channel = mockChannels.find(c => c.id === item.channelId);
                      return (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-semibold text-indigo-700">{item.channelName}</td>
                          <td className="p-3 text-slate-600">{channel?.lastOrderDate}</td>
                          <td className="p-3 font-bold text-red-600">{item.daysSinceLastOrder} 天</td>
                          <td className="p-3 text-slate-600">{item.phone}</td>
                          <td className="p-3 text-right">
                            <Link href={`/channels/${item.channelId}`} className="text-indigo-600 hover:text-indigo-900 font-bold bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors inline-block">
                              詳細 / 新增拜訪
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column (1 col in large) - Activity Feed & Potential Profile */}
        <div className="space-y-6">
          
          {/* Potential Grading Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              🎯 潛力分級與活躍分佈
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700">A 級 (高成長、高回購、高銷售)</span>
                  <span className="font-bold text-slate-950">{stats.gradeACount} 家</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(stats.gradeACount / stats.totalChannels) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-indigo-700">B 級 (穩定客戶)</span>
                  <span className="font-bold text-slate-950">{stats.gradeBCount} 家</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${(stats.gradeBCount / stats.totalChannels) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-500">C 級 (低活躍或可能流失)</span>
                  <span className="font-bold text-slate-950">{stats.gradeCCount} 家</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: `${(stats.gradeCCount / stats.totalChannels) * 100}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 leading-normal bg-slate-50 p-2.5 rounded border border-slate-100">
              💡 <strong>提示：</strong>評分邏輯已抽象化為 <code>getPotentialGrade</code> 模組，綜合考慮了年營收成長率、30天內叫貨率與月均銷售。
            </p>
          </div>

          {/* Recent Visits activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              📝 最新業務拜訪動態
            </h4>
            <div className="flow-root">
              <ul className="-mb-8">
                {stats.recentVisits.map((visit, visitIdx) => (
                  <li key={visit.id}>
                    <div className="relative pb-8">
                      {visitIdx !== stats.recentVisits.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-sm border border-indigo-100">
                            👤
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5">
                          <p className="text-xs font-bold text-slate-900">
                            {visit.visitor} 拜訪了 <Link href={`/channels/${visit.channelId}`} className="text-indigo-600 hover:underline">{visit.channelName}</Link>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{visit.visitDate} • {visit.purpose}</p>
                          <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded border border-slate-100 line-clamp-2 hover:line-clamp-none transition-all">
                            {visit.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
