import { Channel } from '../types';

export const mockChannels: Channel[] = [
  {
    id: "ch-01",
    name: "健康人生藥局 (大安店)",
    type: "partner",
    address: "台北市大安區信義路三段 150 號",
    latitude: 25.0335,
    longitude: 121.5432,
    contactName: "張大明",
    phone: "02-2700-1234",
    ownerSales: "Jerry Chen",
    startDate: "2024-01-15",
    notes: "大安區指標型藥局，客流量大。近期需要關注維生素C與益生菌庫存。",
    lastOrderDate: "2026-07-02", // 正常 (8天前)
    monthlySales: 185000, // 高銷售額
    yearlyGrowthRate: 0.18, // 高成長 (18%)
    productCount: 12,
    inventoryItems: [
      {
        productName: "超級益生菌 Pro (30包入)",
        quantity: 0, // 無庫存 (紅色)
        safetyStock: 15,
        expiryDate: "2027-12-31", // 正常 (>12個月)
        lastUpdatedAt: "2026-07-01"
      },
      {
        productName: "維生素 C 高效發泡錠",
        quantity: 8, // 低於安全庫存 (黃色)
        safetyStock: 20,
        expiryDate: "2026-11-30", // 剩餘效期 < 6個月 (紅色)
        lastUpdatedAt: "2026-07-01"
      },
      {
        productName: "高純度深海魚油膠囊",
        quantity: 45, // 正常
        safetyStock: 30,
        expiryDate: "2028-06-15", // 正常
        lastUpdatedAt: "2026-07-01"
      }
    ],
    visitRecords: [
      {
        id: "v-01-1",
        visitDate: "2026-07-05",
        visitor: "Jerry Chen",
        purpose: "定期拜訪與客訴處理",
        notes: "店長反映益生菌缺貨已久，客戶催問。需要協助緊急調貨。另外提及效期較短的維生素C可能需要下架促銷。"
      },
      {
        id: "v-01-2",
        visitDate: "2026-06-15",
        visitor: "Jerry Chen",
        purpose: "推廣新品眼部葉黃素",
        notes: "向藥師介紹新包裝葉黃素，藥師表示有興趣，但希望能先提供樣品試用。"
      }
    ]
  },
  {
    id: "ch-02",
    name: "安欣聯合診所",
    type: "partner",
    address: "台北市信義區忠孝東路五段 220 號",
    latitude: 25.0412,
    longitude: 121.5654,
    contactName: "林怡君 藥師",
    phone: "02-2720-5678",
    ownerSales: "Jerry Chen",
    startDate: "2024-05-10",
    notes: "自費藥品/保健品消耗穩定。回購規律性高。",
    lastOrderDate: "2026-05-25", // 關注 (46天前，屬 31-60天)
    monthlySales: 85000, // 穩定
    yearlyGrowthRate: 0.05, // 穩定成長 (5%)
    productCount: 5,
    inventoryItems: [
      {
        productName: "關節維護軟骨素",
        quantity: 18, // 正常
        safetyStock: 10,
        expiryDate: "2027-03-20", // 6-12個月 (黃色)
        lastUpdatedAt: "2026-07-05"
      },
      {
        productName: "高純度深海魚油膠囊",
        quantity: 12, // 正常
        safetyStock: 10,
        expiryDate: "2028-02-10", // 正常 (>12個月)
        lastUpdatedAt: "2026-07-05"
      }
    ],
    visitRecords: [
      {
        id: "v-02-1",
        visitDate: "2026-06-28",
        visitor: "Jerry Chen",
        purpose: "售後追蹤",
        notes: "林藥師反映軟骨素銷路變好，但最近叫貨頻率稍微拉長，因診所內部流程調整。預計下週會重新叫貨一批。"
      }
    ]
  },
  {
    id: "ch-03",
    name: "博登藥局 (大安旗艦店)",
    type: "prospect", // 待開發通路
    address: "台北市大安區復興南路二段 88 號",
    latitude: 25.0282,
    longitude: 121.5428,
    contactName: "王經理",
    phone: "0912-345-678",
    ownerSales: "Alice Wang",
    startDate: "2026-06-01",
    notes: "大安區連鎖大藥局，目前主要銷售競品。正在接觸中，極具潛力。",
    lastOrderDate: "2026-07-10", // 未曾叫貨，初始化為基準日以便計算
    monthlySales: 0,
    yearlyGrowthRate: 0,
    productCount: 0,
    inventoryItems: [],
    visitRecords: [
      {
        id: "v-03-1",
        visitDate: "2026-06-20",
        visitor: "Alice Wang",
        purpose: "初次拜訪與產品簡報",
        notes: "拜訪了王經理，簡報我們的主力保健食品。對方對高毛利的深海魚油很有興趣，願意索取合約草案評估。"
      }
    ]
  },
  {
    id: "ch-04",
    name: "合康連鎖藥妝 (信義店)",
    type: "negotiating", // 洽談中通路
    address: "台北市信義區莊敬路 320 號",
    latitude: 25.0298,
    longitude: 121.5612,
    contactName: "陳店長",
    phone: "02-2345-9988",
    ownerSales: "Alice Wang",
    startDate: "2026-03-15",
    notes: "正在進行進架合約條件談判。主要爭取排他性陳列位置。",
    lastOrderDate: "2026-07-10",
    monthlySales: 0,
    yearlyGrowthRate: 0,
    productCount: 0,
    inventoryItems: [],
    visitRecords: [
      {
        id: "v-04-1",
        visitDate: "2026-07-08",
        visitor: "Alice Wang",
        purpose: "合約條件議定",
        notes: "陳店長同意上架，但要求首批進貨折扣與陳列補貼費。Alice 已向主管提報專案審查。"
      },
      {
        id: "v-04-2",
        visitDate: "2026-06-10",
        visitor: "Alice Wang",
        purpose: "二次拜訪送樣品",
        notes: "提供樣品給店員試用，店員給予正面評價。陳店長態度轉趨積極。"
      }
    ]
  },
  {
    id: "ch-05",
    name: "德昌大藥局 (中山店)",
    type: "partner", // 合作通路
    address: "台北市中山區民生東路二段 45 號",
    latitude: 25.0582,
    longitude: 121.5298,
    contactName: "許老闆",
    phone: "02-2511-2233",
    ownerSales: "Jerry Chen",
    startDate: "2025-02-20",
    notes: "中山區老字號藥局，高成長、高銷售，配合度極高，屬於核心 A 級通路。",
    lastOrderDate: "2026-06-28", // 正常 (12天前)
    monthlySales: 220000, // 高銷售
    yearlyGrowthRate: 0.25, // 高成長 (25%)
    productCount: 18,
    inventoryItems: [
      {
        productName: "超級益生菌 Pro (30包入)",
        quantity: 40,
        safetyStock: 15,
        expiryDate: "2027-10-15", // 正常
        lastUpdatedAt: "2026-07-08"
      },
      {
        productName: "高純度深海魚油膠囊",
        quantity: 35,
        safetyStock: 20,
        expiryDate: "2027-11-20", // 正常
        lastUpdatedAt: "2026-07-08"
      },
      {
        productName: "兒童高鈣成長嚼錠",
        quantity: 25,
        safetyStock: 10,
        expiryDate: "2027-08-05", // 正常
        lastUpdatedAt: "2026-07-08"
      }
    ],
    visitRecords: [
      {
        id: "v-05-1",
        visitDate: "2026-06-25",
        visitor: "Jerry Chen",
        purpose: "定期巡店與補貨",
        notes: "許老闆表示益生菌在社區推廣極佳，直接續下大單。並詢問是否能加入中秋禮盒特惠方案。"
      }
    ]
  },
  {
    id: "ch-06",
    name: "康是美 (台北站前店)",
    type: "suspended", // 已停止合作通路
    address: "台北市中正區忠孝西路一段 49 號",
    latitude: 25.0468,
    longitude: 121.5169,
    contactName: "李副理",
    phone: "02-2311-6677",
    ownerSales: "Bob Li",
    startDate: "2023-08-01",
    notes: "因總部合約條件未談攏，於今年初暫時停止合約與補貨。屬於流失通路。",
    lastOrderDate: "2025-11-15", // 失溫 (200多天前，屬 COLD)
    monthlySales: 0,
    yearlyGrowthRate: -0.40, // 負成長
    productCount: 0,
    inventoryItems: [
      {
        productName: "維生素 C 高效發泡錠",
        quantity: 0,
        safetyStock: 10,
        expiryDate: "2026-06-30", // 已過期 (紅色)
        lastUpdatedAt: "2025-11-15"
      }
    ],
    visitRecords: [
      {
        id: "v-06-1",
        visitDate: "2026-03-10",
        visitor: "Bob Li",
        purpose: "結案盤點與回收",
        notes: "進行關帳盤點。確認剩餘發泡錠庫存不作回收，由店面自行報廢。合約終止結案。"
      }
    ]
  },
  {
    id: "ch-07",
    name: "美康健保藥局 (松山店)",
    type: "partner",
    address: "台北市松山區南京東路五段 180 號",
    latitude: 25.0515,
    longitude: 121.5623,
    contactName: "郭藥師",
    phone: "02-2766-4455",
    ownerSales: "Bob Li",
    startDate: "2025-06-01",
    notes: "松山區穩定合作對象，主要銷售常規保健食品。進貨頻率約 45 ~ 60 天。",
    lastOrderDate: "2026-05-12", // 警示 (59天前，屬 31-60天 / 61-90天交界)
    monthlySales: 45000,
    yearlyGrowthRate: 0.02, // 微幅成長 (2%)
    productCount: 4,
    inventoryItems: [
      {
        productName: "高純度深海魚油膠囊",
        quantity: 8, // 低於安全庫存 (黃色)
        safetyStock: 15,
        expiryDate: "2026-09-30", // < 6個月 (紅色)
        lastUpdatedAt: "2026-05-12"
      }
    ],
    visitRecords: [
      {
        id: "v-07-1",
        visitDate: "2026-05-12",
        visitor: "Bob Li",
        purpose: "補貨引導與客情維繫",
        notes: "提醒郭藥師深海魚油快要進入六個月效期警戒，且庫存只剩 8 瓶低於安全線。郭藥師表示近期有些滯銷，想先消化，暫不續訂。需特別關注其後續銷量。"
      }
    ]
  }
];
