"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockChannels } from '@/data/mock';
import { Channel, ChannelType } from '@/types';
import { 
  getChannelOverallInventoryStatus, 
  getChannelOverallExpiryStatus, 
  getOrderFrequencyStatus, 
  getPotentialGrade,
  getDaysDifference,
  parseDate
} from '@/utils/status';

export default function ChannelListPage() {
  const referenceDate = new Date('2026-07-10');

  // React State for active channels (to show creation capabilities)
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  
  // Modal State for creating new channel
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    type: 'prospect' as ChannelType,
    address: '',
    latitude: '25.0335',
    longitude: '121.5432',
    contactName: '',
    phone: '',
    ownerSales: 'Jerry Chen',
    notes: '',
    monthlySales: '0',
    yearlyGrowthRate: '0',
  });

  // Handle Search and Filtering
  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = 
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.phone.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesType = filterType === 'all' || channel.type === filterType;
      
      const grade = getPotentialGrade(channel, referenceDate);
      const matchesGrade = filterGrade === 'all' || grade === filterGrade;
      
      return matchesSearch && matchesType && matchesGrade;
    });
  }, [channels, searchQuery, filterType, filterGrade, referenceDate]);

  // Handle Create Channel Submission
  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.name || !newChannel.address) {
      alert("請填寫通路名稱與地址！");
      return;
    }

    const created: Channel = {
      id: `ch-generated-${Date.now()}`,
      name: newChannel.name,
      type: newChannel.type,
      address: newChannel.address,
      latitude: parseFloat(newChannel.latitude) || 25.03,
      longitude: parseFloat(newChannel.longitude) || 121.54,
      contactName: newChannel.contactName || "無記錄",
      phone: newChannel.phone || "無記錄",
      ownerSales: newChannel.ownerSales,
      startDate: new Date().toISOString().split('T')[0],
      notes: newChannel.notes || "新增通路",
      lastOrderDate: '2026-07-10', // initialized to reference date
      monthlySales: parseFloat(newChannel.monthlySales) || 0,
      yearlyGrowthRate: (parseFloat(newChannel.yearlyGrowthRate) || 0) / 100,
      productCount: 0,
      inventoryItems: [],
      visitRecords: []
    };

    setChannels([created, ...channels]);
    setIsModalOpen(false);
    // Reset form
    setNewChannel({
      name: '',
      type: 'prospect',
      address: '',
      latitude: '25.0335',
      longitude: '121.5432',
      contactName: '',
      phone: '',
      ownerSales: 'Jerry Chen',
      notes: '',
      monthlySales: '0',
      yearlyGrowthRate: '0',
    });
  };

  // Helper labels & colors
  const getTypeBadge = (type: ChannelType) => {
    switch (type) {
      case 'partner':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">合作通路</span>;
      case 'negotiating':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">洽談中</span>;
      case 'prospect':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">待開發</span>;
      case 'suspended':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">終止合作</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top title and add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">🏪 通路清單與戰情管理</h2>
          <p className="text-sm text-slate-500 mt-1">管理、分析與追蹤您負責的所有診所、藥局與分銷商。</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <span>➕</span>
          <span>開發新通路</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
          <input 
            type="text" 
            placeholder="搜尋通路名稱、聯絡人、電話、地址..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-colors"
          />
        </div>

        {/* Type dropdown */}
        <div className="w-full md:w-48">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-colors"
          >
            <option value="all">所有通路類型</option>
            <option value="partner">合作通路</option>
            <option value="negotiating">洽談中通路</option>
            <option value="prospect">待開發通路</option>
            <option value="suspended">已停止合作</option>
          </select>
        </div>

        {/* Grade dropdown */}
        <div className="w-full md:w-44">
          <select 
            value={filterGrade} 
            onChange={(e) => setFilterGrade(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-colors"
          >
            <option value="all">所有潛力等級</option>
            <option value="A">A 級 (高回購/高成長)</option>
            <option value="B">B 級 (穩定型通路)</option>
            <option value="C">C 級 (流失風險/低活躍)</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-4 pl-6">通路名稱</th>
                <th className="p-4">類型</th>
                <th className="p-4">潛力級別</th>
                <th className="p-4">庫存狀態</th>
                <th className="p-4">效期追蹤</th>
                <th className="p-4">最後叫貨 / 頻率</th>
                <th className="p-4 text-right">月平均銷售</th>
                <th className="p-4 text-right pr-6">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredChannels.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-sm">
                    沒有找到符合篩選條件的通路。
                  </td>
                </tr>
              ) : (
                filteredChannels.map(channel => {
                  const invStatus = getChannelOverallInventoryStatus(channel.inventoryItems);
                  const expStatus = getChannelOverallExpiryStatus(channel.inventoryItems, referenceDate);
                  const freqStatus = getOrderFrequencyStatus(channel.lastOrderDate, referenceDate);
                  const grade = getPotentialGrade(channel, referenceDate);

                  return (
                    <tr key={channel.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      {/* Name & Address */}
                      <td className="p-4 pl-6">
                        <div className="space-y-0.5 max-w-[180px] sm:max-w-[240px]">
                          <p className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors truncate">
                            <Link href={`/channels/${channel.id}`}>{channel.name}</Link>
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{channel.address}</p>
                        </div>
                      </td>

                      {/* Type badge */}
                      <td className="p-4">
                        {getTypeBadge(channel.type)}
                      </td>

                      {/* Grade */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold ${grade === 'A' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : grade === 'B' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {grade} 級
                        </span>
                      </td>

                      {/* Inventory status badge */}
                      <td className="p-4">
                        {invStatus === 'NORMAL' && <span className="text-emerald-600 font-semibold flex items-center space-x-1"><span>🟢</span><span>正常</span></span>}
                        {invStatus === 'LOW' && <span className="text-amber-500 font-semibold flex items-center space-x-1"><span>🟡</span><span>低於安全</span></span>}
                        {invStatus === 'OUT_OF_STOCK' && <span className="text-red-600 font-bold flex items-center space-x-1 animate-pulse"><span>🔴</span><span>無庫存</span></span>}
                      </td>

                      {/* Expiry status badge */}
                      <td className="p-4">
                        {expStatus === 'SAFE' && <span className="text-emerald-600 font-semibold flex items-center space-x-1"><span>🟢</span><span>安全</span></span>}
                        {expStatus === 'WARNING' && <span className="text-amber-500 font-semibold flex items-center space-x-1"><span>🟡</span><span>臨期(6-12m)</span></span>}
                        {expStatus === 'CRITICAL' && <span className="text-red-500 font-bold flex items-center space-x-1"><span>🟥</span><span>急迫(&lt;6m)</span></span>}
                      </td>

                      {/* Order date / frequency */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <p className="text-slate-800 font-medium">{channel.lastOrderDate === '2026-07-10' && channel.productCount === 0 ? "尚未叫貨" : channel.lastOrderDate}</p>
                          <p className="text-[10px] text-slate-400">
                            {(() => {
                              if (channel.productCount === 0) return "無品項";
                              const days = getDaysDifference(parseDate(channel.lastOrderDate), referenceDate);
                              if (freqStatus === 'NORMAL') return <span className="text-emerald-600 font-semibold">正常 ({days}天)</span>;
                              if (freqStatus === 'ATTENTION') return <span className="text-indigo-600 font-semibold">關注 ({days}天)</span>;
                              if (freqStatus === 'WARNING') return <span className="text-amber-500 font-semibold">警示 ({days}天)</span>;
                              return <span className="text-purple-600 font-bold">失溫 ({days}天)</span>;
                            })()}
                          </p>
                        </div>
                      </td>

                      {/* Monthly sales */}
                      <td className="p-4 text-right font-bold text-slate-900 text-sm">
                        ${channel.monthlySales.toLocaleString()}
                        <p className="text-[9px] text-slate-400 font-normal">
                          {channel.yearlyGrowthRate > 0 ? (
                            <span className="text-emerald-600 font-semibold">↑ {(channel.yearlyGrowthRate * 100).toFixed(0)}% 成長</span>
                          ) : channel.yearlyGrowthRate < 0 ? (
                            <span className="text-red-500 font-semibold">↓ {Math.abs(channel.yearlyGrowthRate * 100).toFixed(0)}% 衰退</span>
                          ) : (
                            <span>無變化</span>
                          )}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right pr-6">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/channels/${channel.id}`} className="px-2.5 py-1.5 rounded-lg text-indigo-700 bg-indigo-50 font-bold hover:bg-indigo-100 transition-all">
                            戰情詳細
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>共顯示 {filteredChannels.length} 筆通路數據。</span>
          <span>資料儲存：MVP 本機 React 記憶體，未來可對接 Supabase API 讀取。</span>
        </div>
      </div>

      {/* Creation Modal (新增通路表單) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden animate-zoomIn flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-md">🏥 開發新通路：建立基本戰情欄位</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateChannel} className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">通路名稱 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="例如：惠康健保大藥局" 
                    value={newChannel.name}
                    onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">初始狀態</label>
                  <select 
                    value={newChannel.type}
                    onChange={(e) => setNewChannel({...newChannel, type: e.target.value as ChannelType})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  >
                    <option value="partner">合作通路</option>
                    <option value="negotiating">洽談中通路</option>
                    <option value="prospect">待開發通路</option>
                    <option value="suspended">終止合作</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">聯絡電話</label>
                  <input 
                    type="text" 
                    placeholder="如：02-2345-6789" 
                    value={newChannel.phone}
                    onChange={(e) => setNewChannel({...newChannel, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">通路地址 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="台北市大安區..." 
                    value={newChannel.address}
                    onChange={(e) => setNewChannel({...newChannel, address: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                {/* Latitude */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">緯度 Latitude (經緯標記)</label>
                  <input 
                    type="text" 
                    value={newChannel.latitude}
                    onChange={(e) => setNewChannel({...newChannel, latitude: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">經度 Longitude (經緯標記)</label>
                  <input 
                    type="text" 
                    value={newChannel.longitude}
                    onChange={(e) => setNewChannel({...newChannel, longitude: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                {/* Contact Name */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">主要聯絡人 / 職稱</label>
                  <input 
                    type="text" 
                    placeholder="如：王藥師" 
                    value={newChannel.contactName}
                    onChange={(e) => setNewChannel({...newChannel, contactName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                {/* Owner Sales */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">擔當業務負責人</label>
                  <input 
                    type="text" 
                    value={newChannel.ownerSales}
                    onChange={(e) => setNewChannel({...newChannel, ownerSales: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors font-medium text-slate-700"
                  />
                </div>

                {/* Monthly sales estimate */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">預估月銷售額 (NTD)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={newChannel.monthlySales}
                    onChange={(e) => setNewChannel({...newChannel, monthlySales: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors font-semibold"
                  />
                </div>

                {/* Yearly growth */}
                <div>
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">預估成長率 (正負 %)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={newChannel.yearlyGrowthRate}
                    onChange={(e) => setNewChannel({...newChannel, yearlyGrowthRate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors font-semibold"
                  />
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-500 font-bold uppercase mb-1 block">重要特徵與備忘備註</label>
                  <textarea 
                    rows={3}
                    placeholder="通路位置特徵、合作切入點、主要競爭品牌..." 
                    value={newChannel.notes}
                    onChange={(e) => setNewChannel({...newChannel, notes: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none transition-colors resize-none"
                  />
                </div>

              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg"
                >
                  確認建立並放入戰情地圖
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
