export type ChannelType = 'partner' | 'negotiating' | 'prospect' | 'suspended';

export interface InventoryItem {
  productName: string;
  quantity: number;
  safetyStock: number;
  expiryDate: string; // YYYY-MM-DD
  lastUpdatedAt: string; // YYYY-MM-DD
}

export interface VisitRecord {
  id: string;
  visitDate: string; // YYYY-MM-DD
  visitor: string;
  purpose: string;
  notes: string;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  address: string;
  latitude: number;
  longitude: number;
  contactName: string;
  phone: string;
  ownerSales: string;
  startDate: string; // YYYY-MM-DD
  notes: string;
  inventoryItems: InventoryItem[];
  lastOrderDate: string; // YYYY-MM-DD
  monthlySales: number; // NTD
  yearlyGrowthRate: number; // Decimal, e.g. 0.15 for 15%
  productCount: number;
  visitRecords: VisitRecord[];
}

export type InventoryStatus = 'NORMAL' | 'LOW' | 'OUT_OF_STOCK'; // 綠, 黃, 紅
export type ExpiryStatus = 'SAFE' | 'WARNING' | 'CRITICAL'; // 綠, 黃, 紅 (>12m, 6-12m, <6m)
export type OrderFrequencyStatus = 'NORMAL' | 'ATTENTION' | 'WARNING' | 'COLD'; // 0-30, 31-60, 61-90, 90+ days
export type PotentialGrade = 'A' | 'B' | 'C';
