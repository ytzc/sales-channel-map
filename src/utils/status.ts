import { 
  InventoryItem, 
  InventoryStatus, 
  ExpiryStatus, 
  OrderFrequencyStatus, 
  PotentialGrade, 
  Channel 
} from '../types';

// Anchor date for MVP mock data consistency: 2026-07-10
const DEFAULT_REFERENCE_DATE = new Date('2026-07-10');

/**
 * Helper to parse date string safely
 */
export function parseDate(dateStr: string): Date {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Calculate day difference between two dates (date2 - date1)
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate approximate month difference between two dates (date2 - date1)
 */
export function getMonthsDifference(date1: Date, date2: Date): number {
  const yearsDiff = date2.getFullYear() - date1.getFullYear();
  const monthsDiff = date2.getMonth() - date1.getMonth();
  const daysDiff = date2.getDate() - date1.getDate();
  
  let totalMonths = yearsDiff * 12 + monthsDiff;
  if (daysDiff < 0) {
    totalMonths -= 1; // Not a full month yet
  }
  return totalMonths;
}

/**
 * 1. 庫存狀態規則 (單一品項)
 * - 綠色 (NORMAL)：庫存正常 (quantity >= safetyStock)
 * - 黃色 (LOW)：低於安全庫存 (0 < quantity < safetyStock)
 * - 紅色 (OUT_OF_STOCK)：無庫存 (quantity === 0)
 */
export function getInventoryStatus(item: InventoryItem): InventoryStatus {
  if (item.quantity <= 0) {
    return 'OUT_OF_STOCK';
  }
  if (item.quantity < item.safetyStock) {
    return 'LOW';
  }
  return 'NORMAL';
}

/**
 * 取得通道整體的庫存狀態
 * 規則：若有任一無庫存 -> OUT_OF_STOCK；若無缺貨但有低於安全庫存 -> LOW；其餘正常
 */
export function getChannelOverallInventoryStatus(items: InventoryItem[]): InventoryStatus {
  if (!items || items.length === 0) return 'NORMAL';
  
  let hasLow = false;
  let hasOutOfStock = false;
  
  for (const item of items) {
    const status = getInventoryStatus(item);
    if (status === 'OUT_OF_STOCK') {
      hasOutOfStock = true;
    } else if (status === 'LOW') {
      hasLow = true;
    }
  }
  
  if (hasOutOfStock) return 'OUT_OF_STOCK';
  if (hasLow) return 'LOW';
  return 'NORMAL';
}

/**
 * 2. 效期狀態規則 (單一品項)
 * - 綠色 (SAFE)：大於 12 個月
 * - 黃色 (WARNING)：6 到 12 個月
 * - 紅色 (CRITICAL)：小於 6 個月
 */
export function getExpiryStatus(expiryDateStr: string, referenceDate: Date = DEFAULT_REFERENCE_DATE): ExpiryStatus {
  const expDate = parseDate(expiryDateStr);
  const months = getMonthsDifference(referenceDate, expDate);
  
  if (months < 6) {
    return 'CRITICAL';
  }
  if (months <= 12) {
    return 'WARNING';
  }
  return 'SAFE';
}

/**
 * 取得通道整體的效期狀態
 * 規則：若有任一品項小於6個月 -> CRITICAL；若無 CRITICAL 但有 6-12 個月 -> WARNING；其餘 SAFE
 */
export function getChannelOverallExpiryStatus(items: InventoryItem[], referenceDate: Date = DEFAULT_REFERENCE_DATE): ExpiryStatus {
  if (!items || items.length === 0) return 'SAFE';
  
  let hasWarning = false;
  let hasCritical = false;
  
  for (const item of items) {
    const status = getExpiryStatus(item.expiryDate, referenceDate);
    if (status === 'CRITICAL') {
      hasCritical = true;
    } else if (status === 'WARNING') {
      hasWarning = true;
    }
  }
  
  if (hasCritical) return 'CRITICAL';
  if (hasWarning) return 'WARNING';
  return 'SAFE';
}

/**
 * 3. 叫貨頻率規則
 * 依最後叫貨日計算：
 * - 0 到 30 天：正常 (NORMAL)
 * - 31 到 60 天：關注 (ATTENTION)
 * - 61 到 90 天：警示 (WARNING)
 * - 90 天以上：失溫通路 (COLD)
 */
export function getOrderFrequencyStatus(lastOrderDateStr: string, referenceDate: Date = DEFAULT_REFERENCE_DATE): OrderFrequencyStatus {
  const lastOrder = parseDate(lastOrderDateStr);
  const days = getDaysDifference(lastOrder, referenceDate);
  
  if (days <= 30) {
    return 'NORMAL';
  }
  if (days <= 60) {
    return 'ATTENTION';
  }
  if (days <= 90) {
    return 'WARNING';
  }
  return 'COLD';
}

/**
 * 4. 潛力分級規則 (獨立評分邏輯，方便未來調整)
 * 評分標準 (總分 1-9 分)：
 * - 成長率 (1-3分)：成長率 >= 15% (3分), 0% ~ 15% (2分), < 0% (1分)
 * - 叫貨頻率 (1-3分)：30天內叫貨 (3分), 31-90天 (2分), > 90天 (1分)
 * - 月銷售額 (1-3分)：>= 10萬 (3分), 3萬 ~ 10萬 (2分), < 3萬 (1分)
 * 
 * 總分級：
 * - A 級：高成長、高回購、高銷售 (總分 >= 7)
 * - B 級：穩定客戶 (總分 5 ~ 6)
 * - C 級：低活躍或可能流失 (總分 <= 4)
 */
export function getPotentialGrade(channel: Partial<Channel>, referenceDate: Date = DEFAULT_REFERENCE_DATE): PotentialGrade {
  const growth = channel.yearlyGrowthRate ?? 0;
  const lastOrder = channel.lastOrderDate ?? '2026-07-10';
  const sales = channel.monthlySales ?? 0;
  
  // 1. 成長率分數
  let growthScore = 1;
  if (growth >= 0.15) {
    growthScore = 3;
  } else if (growth >= 0) {
    growthScore = 2;
  }
  
  // 2. 叫貨頻率分數
  const daysSinceLastOrder = getDaysDifference(parseDate(lastOrder), referenceDate);
  let orderScore = 1;
  if (daysSinceLastOrder <= 30) {
    orderScore = 3;
  } else if (daysSinceLastOrder <= 90) {
    orderScore = 2;
  }
  
  // 3. 月銷售額分數
  let salesScore = 1;
  if (sales >= 100000) {
    salesScore = 3;
  } else if (sales >= 30000) {
    salesScore = 2;
  }
  
  const totalScore = growthScore + orderScore + salesScore;
  
  if (totalScore >= 7) {
    return 'A';
  }
  if (totalScore >= 5) {
    return 'B';
  }
  return 'C';
}
