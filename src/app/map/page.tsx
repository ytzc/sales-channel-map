"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockChannels } from '@/data/mock';
import { Channel, ChannelType } from '@/types';
import { 
  getChannelOverallInventoryStatus, 
  getChannelOverallExpiryStatus, 
  getOrderFrequencyStatus, 
  getPotentialGrade 
} from '@/utils/status';

type LayerType = 'type' | 'inventory' | 'expiry' | 'frequency';

export default function MapPage() {
  const referenceDate = new Date('2026-07-10');

  // State Management
  const [selectedLayer, setSelectedLayer] = useState<LayerType>('type');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(mockChannels[0]);
  const [mapboxToken, setMapboxToken] = useState<string>(
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""
  );

  // Filter channels
  const filteredChannels = useMemo(() => {
    return mockChannels.filter(channel => {
      const matchesType = filterType === 'all' || channel.type === filterType;
      const grade = getPotentialGrade(channel, referenceDate);
      const matchesGrade = filterGrade === 'all' || grade === filterGrade;
      return matchesType && matchesGrade;
    });
  }, [filterType, filterGrade, referenceDate]);

  // Helper to determine dot color depending on the active layer
  const getMarkerColor = (channel: Channel, layer: LayerType) => {
    if (layer === 'type') {
      switch (channel.type) {
        case 'partner': return 'bg-indigo-600 text-white border-indigo-200';
        case 'negotiating': return 'bg-amber-500 text-white border-amber-200';
        case 'prospect': return 'bg-emerald-600 text-white border-emerald-200';
        case 'suspended': return 'bg-slate-400 text-slate-800 border-slate-200';
      }
    } else if (layer === 'inventory') {
      const inv = getChannelOverallInventoryStatus(channel.inventoryItems);
      switch (inv) {
        case 'NORMAL': return 'bg-emerald-500 text-white border-emerald-200';
        case 'LOW': return 'bg-amber-400 text-slate-900 border-amber-100';
        case 'OUT_OF_STOCK': return 'bg-red-500 text-white border-red-200 animate-pulse';
      }
    } else if (layer === 'expiry') {
      const exp = getChannelOverallExpiryStatus(channel.inventoryItems, referenceDate);
      switch (exp) {
        case 'SAFE': return 'bg-emerald-500 text-white border-emerald-200';
        case 'WARNING': return 'bg-amber-400 text-slate-900 border-amber-100';
        case 'CRITICAL': return 'bg-red-500 text-white border-red-200 animate-pulse';
      }
    } else if (layer === 'frequency') {
      const freq = getOrderFrequencyStatus(channel.lastOrderDate, referenceDate);
      switch (freq) {
        case 'NORMAL': return 'bg-emerald-500 text-white border-emerald-200';
        case 'ATTENTION': return 'bg-blue-500 text-white border-blue-200';
        case 'WARNING': return 'bg-amber-500 text-white border-amber-200';
        case 'COLD': return 'bg-purple-600 text-white border-purple-200';
      }
    }
    return 'bg-slate-500';
  };

  const getMarkerLegend = (layer: LayerType) => {
    switch (layer) {
      case 'type':
        return [
          { color: 'bg-indigo-600', label: '合作通路' },
          { color: 'bg-amber-500', label: '洽談中通路' },
          { color: 'bg-emerald-600', label: '待開發通路' },
          { color: 'bg-slate-400', label: '已停止合作' }
        ];
      case 'inventory':
        return [
          { color: 'bg-emerald-500', label: '庫存正常' },
          { color: 'bg-amber-400', label: '低於安全庫存' },
          { color: 'bg-red-500', label: '無庫存 (缺貨)' }
        ];
      case 'expiry':
        return [
          { color: 'bg-emerald-500', label: '安全 (大於 12 個月)' },
          { color: 'bg-amber-400', label: '警告 (6 到 12 個月)' },
          { color: 'bg-red-500', label: '危急 (小於 6 個月)' }
        ];
      case 'frequency':
        return [
          { color: 'bg-emerald-500', label: '正常 (0-30 天)' },
          { color: 'bg-blue-500', label: '關注 (31-60 天)' },
          { color: 'bg-amber-500', label: '警示 (61-90 天)' },
          { color: 'bg-purple-600', label: '失溫 (90 天以上)' }
        ];
    }
  };

  // Coordinates mapping for Taipei dynamic localized map grid fallback
  // Since we are designing a visually perfect MVP, we place markers in a high-tech tactical schematic map grid of Taipei
  // Longitude ranges from 121.50 to 121.57 (7 km)
  // Latitude ranges from 25.02 to 25.09 (7 km)
  const getRelativePosition = (lat: number, lng: number) => {
    const minLng = 121.5000;
    const maxLng = 121.5700;
    const minLat = 25.0200;
    const maxLat = 25.0900;

    // Convert to percentage coordinates for relative positioning
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100; // Invert y because screen coordinates start top-left
    
    // Clamp to boundaries
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px] bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 animate-fadeIn">
      {/* Top Map Action Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">戰情圖層</span>
          <button 
            onClick={() => setSelectedLayer('type')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedLayer === 'type' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            🏪 營運通路
          </button>
          <button 
            onClick={() => setSelectedLayer('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedLayer === 'inventory' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            📦 庫存分析
          </button>
          <button 
            onClick={() => setSelectedLayer('expiry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedLayer === 'expiry' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            ⏳ 效期追蹤
          </button>
          <button 
            onClick={() => setSelectedLayer('frequency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedLayer === 'frequency' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            ❄️ 叫貨頻率
          </button>
        </div>

        {/* Warning Badge if Mapbox Key is missing */}
        {!mapboxToken && (
          <div className="flex items-center space-x-2 text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg px-3 py-1.5 font-medium">
            <span>⚠️</span>
            <span>已啟動戰術網格 fallback 模式。請至 <code>.env.local</code> 設定 <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>。</span>
          </div>
        )}
      </div>

      {/* Main Workspace: Left Controls, Center Map */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Interactive Control Panel */}
        <aside className="w-full md:w-80 bg-slate-950 border-r border-slate-800 p-5 flex flex-col space-y-5 overflow-y-auto flex-shrink-0">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">篩選與過濾</h4>
            
            {/* Type filter */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 block">通路類型</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="all">顯示所有通路 ({mockChannels.length})</option>
                  <option value="partner">僅顯示合作通路</option>
                  <option value="negotiating">僅顯示洽談中通路</option>
                  <option value="prospect">僅顯示待開發通路</option>
                  <option value="suspended">僅顯示停止合作</option>
                </select>
              </div>

              {/* Potential grade filter */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 block">潛力等級 (A/B/C)</label>
                <select 
                  value={filterGrade} 
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="all">顯示所有分級</option>
                  <option value="A">A 級 (高成長回購)</option>
                  <option value="B">B 級 (穩定客戶)</option>
                  <option value="C">C 級 (低活躍流失)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current Layer Legend */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">當前圖例解說</h5>
            <div className="space-y-2">
              {getMarkerLegend(selectedLayer).map((leg, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 text-xs">
                  <span className={`w-3.5 h-3.5 rounded-full border border-white/10 ${leg.color}`}></span>
                  <span className="text-slate-300 font-medium">{leg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fast Jumper */}
          <div className="flex-1 flex flex-col min-h-[150px]">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">快速定位通路 ({filteredChannels.length})</h5>
            <div className="flex-1 border border-slate-800 rounded-lg overflow-y-auto bg-slate-900 divide-y divide-slate-800/60">
              {filteredChannels.length === 0 ? (
                <p className="p-4 text-xs text-slate-500 text-center">無符合條件通路</p>
              ) : (
                filteredChannels.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full text-left p-2.5 text-xs transition-all flex items-center justify-between ${selectedChannel?.id === channel.id ? 'bg-indigo-950/50 border-l-2 border-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-800/40'}`}
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold truncate">{channel.name}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 truncate">{channel.address}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-800 px-1.5 py-0.5 rounded text-indigo-400">
                      {getPotentialGrade(channel, referenceDate)} 級
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Center: Tactical grid map representation */}
        <div className="flex-1 bg-slate-950 flex items-center justify-center relative overflow-hidden p-6">
          
          {/* Schematic grid background pattern to look hyper tech */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, #4f46e5 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}></div>

          {/* Radar circle concentric lines */}
          <div className="absolute w-[80%] aspect-square max-w-[600px] border border-indigo-500/[0.04] rounded-full pointer-events-none flex items-center justify-center">
            <div className="w-[70%] aspect-square border border-indigo-500/[0.04] rounded-full flex items-center justify-center">
              <div className="w-[50%] aspect-square border border-indigo-500/[0.03] rounded-full flex items-center justify-center">
                <div className="w-[30%] aspect-square border border-indigo-500/[0.02] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Taipei schematic vector zone labels */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15]">
            <div className="absolute top-[20%] left-[25%] text-[10px] font-bold text-slate-400 tracking-widest">士林區 SHILIN</div>
            <div className="absolute top-[45%] left-[65%] text-[10px] font-bold text-slate-400 tracking-widest">松山區 SONGSHAN</div>
            <div className="absolute top-[55%] left-[20%] text-[10px] font-bold text-slate-400 tracking-widest">中山區 ZHONGSHAN</div>
            <div className="absolute top-[75%] left-[45%] text-[10px] font-bold text-slate-400 tracking-widest">大安區 DAAN</div>
            <div className="absolute top-[68%] left-[78%] text-[10px] font-bold text-slate-400 tracking-widest">信義區 XINYI</div>
            <div className="absolute top-[70%] left-[10%] text-[10px] font-bold text-slate-400 tracking-widest">萬華區 WANHUA</div>
          </div>

          {/* Actual grid map body */}
          <div className="w-full h-full max-w-[750px] max-h-[550px] relative border border-indigo-500/10 bg-slate-900/40 rounded-2xl p-4 shadow-inner">
            
            {/* Dynamic node rendering */}
            {filteredChannels.map(channel => {
              const { x, y } = getRelativePosition(channel.latitude, channel.longitude);
              const isSelected = selectedChannel?.id === channel.id;
              const markerBg = getMarkerColor(channel, selectedLayer);

              return (
                <div 
                  key={channel.id}
                  className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <button 
                    onClick={() => setSelectedChannel(channel)}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] border-2 shadow-lg transition-all ${markerBg} ${isSelected ? 'scale-125 ring-4 ring-indigo-500/40 z-20' : 'hover:scale-110'}`}
                  >
                    {channel.type === 'partner' ? '🏥' : channel.type === 'negotiating' ? '💬' : channel.type === 'prospect' ? '🆕' : '🛑'}
                    
                    {/* Ring highlight if urgent out of stock */}
                    {getChannelOverallInventoryStatus(channel.inventoryItems) === 'OUT_OF_STOCK' && (
                      <span className="absolute -inset-1 border-2 border-red-500 rounded-full animate-ping opacity-60"></span>
                    )}
                  </button>
                  
                  {/* Floating minimal text under node */}
                  <div className={`absolute left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap bg-slate-950/85 text-[9px] px-1.5 py-0.5 rounded border border-slate-800 transition-opacity ${isSelected ? 'opacity-100 font-bold text-white border-indigo-500' : 'opacity-65 text-slate-400'}`}>
                    {channel.name.split(' (')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Popover Card for selected node */}
          {selectedChannel && (
            <div className="absolute bottom-6 right-6 left-6 md:left-auto md:w-96 bg-slate-950/95 border border-slate-800 p-5 rounded-xl shadow-2xl z-30 flex flex-col backdrop-blur-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white">{selectedChannel.name}</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-400 font-extrabold uppercase">
                      {getPotentialGrade(selectedChannel, referenceDate)} 級
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedChannel.address}</p>
                </div>
                <button 
                  onClick={() => setSelectedChannel(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              </div>

              {/* KPIs for the selected node */}
              <div className="grid grid-cols-3 gap-2 my-3 text-center">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <p className="text-[9px] text-slate-500">庫存狀態</p>
                  <p className="text-xs font-bold mt-0.5">
                    {(() => {
                      const status = getChannelOverallInventoryStatus(selectedChannel.inventoryItems);
                      if (status === 'NORMAL') return <span className="text-emerald-400">🟢 正常</span>;
                      if (status === 'LOW') return <span className="text-amber-400">🟡 低庫存</span>;
                      return <span className="text-red-400">🔴 缺貨</span>;
                    })()}
                  </p>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <p className="text-[9px] text-slate-500">最快到期</p>
                  <p className="text-xs font-bold mt-0.5">
                    {(() => {
                      const status = getChannelOverallExpiryStatus(selectedChannel.inventoryItems, referenceDate);
                      if (status === 'SAFE') return <span className="text-emerald-400">🟢 安全</span>;
                      if (status === 'WARNING') return <span className="text-amber-400">🟡 警告</span>;
                      return <span className="text-red-400">🔴 急迫</span>;
                    })()}
                  </p>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <p className="text-[9px] text-slate-500">叫貨頻率</p>
                  <p className="text-xs font-bold mt-0.5">
                    {(() => {
                      const status = getOrderFrequencyStatus(selectedChannel.lastOrderDate, referenceDate);
                      if (status === 'NORMAL') return <span className="text-emerald-400">🟢 正常</span>;
                      if (status === 'ATTENTION') return <span className="text-blue-400">🔵 關注</span>;
                      if (status === 'WARNING') return <span className="text-amber-400">🟡 警示</span>;
                      return <span className="text-purple-400">🟣 失溫</span>;
                    })()}
                  </p>
                </div>
              </div>

              {/* Secondary details */}
              <div className="text-xs text-slate-300 space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800/80 mb-3.5">
                <p><span className="text-slate-500">聯絡窗口：</span>{selectedChannel.contactName} ({selectedChannel.phone})</p>
                <p><span className="text-slate-500">負責業務：</span>{selectedChannel.ownerSales}</p>
                <p><span className="text-slate-500">月均銷售：</span>${selectedChannel.monthlySales.toLocaleString()} NTD</p>
              </div>

              {/* CTA Action Link */}
              <Link 
                href={`/channels/${selectedChannel.id}`}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-center font-bold text-xs py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                詳細戰情與新增拜訪紀錄 →
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
