import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing } from '../types/marketplace';

const CACHE_KEY = 'campus_marketplace_cached_catalogue';
const LAST_UPDATED_KEY = 'campus_marketplace_last_updated';

// Mock initial data phù hợp môi trường sinh viên DNTU
const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'lst_101',
    sellerId: 'usr_seller_01',
    sellerName: 'Nguyễn Văn Minh (DNTU K17)',
    sellerPhone: '0901234567',
    title: 'Giáo trình Lập trình Di động React Native SDK 51 & 56',
    category: 'textbook',
    price: 65000,
    originalPrice: 85000,
    stock: 3,
    photoUri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    photoCompressedSizeKb: 280,
    photoOriginalSizeKb: 4300,
    description: 'Sách photo bìa bóng còn mới 95%, có sẵn ghi chú đề thi giữa kỳ và bài Lab.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    condition: 'like_new',
  },
  {
    id: 'lst_102',
    sellerId: 'usr_seller_02',
    sellerName: 'Trần Thị Bích Ngọc (Khoa CNTT)',
    sellerPhone: '0912345678',
    title: 'Chuột không dây Logitech Silent M331',
    category: 'electronics',
    price: 180000,
    originalPrice: 240000,
    stock: 1,
    photoUri: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    photoCompressedSizeKb: 310,
    photoOriginalSizeKb: 4800,
    description: 'Bấm êm không phát tiếng động, rất phù hợp ngồi học thư viện và phòng máy.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    condition: 'good',
  },
  {
    id: 'lst_103',
    sellerId: 'usr_seller_01',
    sellerName: 'Nguyễn Văn Minh (DNTU K17)',
    sellerPhone: '0901234567',
    title: 'Máy tính Casio fx-580VN X chính hãng Bitex',
    category: 'stationery',
    price: 320000,
    originalPrice: 350000,
    stock: 2,
    photoUri: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
    photoCompressedSizeKb: 340,
    photoOriginalSizeKb: 5100,
    description: 'Đầy đủ nắp đậy, chưa qua sửa chữa, phục vụ tốt môn Toán cao cấp và Xác suất.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    condition: 'like_new',
  },
  {
    id: 'lst_104',
    sellerId: 'usr_seller_03',
    sellerName: 'Lê Hoàng Long (Ký túc xá DNTU)',
    sellerPhone: '0987654321',
    title: 'Quạt kẹp bàn tích điện mini 10.000mAh',
    category: 'dorm_supplies',
    price: 110000,
    originalPrice: 140000,
    stock: 4,
    photoUri: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?w=600&auto=format&fit=crop&q=80',
    photoCompressedSizeKb: 260,
    photoOriginalSizeKb: 3900,
    description: 'Pin trâu dùng liên tục 8 tiếng, 4 cấp độ gió cho phòng KTX mùa nóng.',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    condition: 'good',
  },
  {
    id: 'lst_105',
    sellerId: 'usr_seller_02',
    sellerName: 'Trần Thị Bích Ngọc (Khoa CNTT)',
    sellerPhone: '0912345678',
    title: 'Áo khoác đồng phục DNTU size L nam nữ',
    category: 'clothing',
    price: 95000,
    originalPrice: 95000,
    stock: 1,
    photoUri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    photoCompressedSizeKb: 295,
    photoOriginalSizeKb: 4200,
    description: 'Chất gió 2 lớp dày dặn, khóa kéo mượt mà, mặc đúng 2 lần kỳ quân sự.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    condition: 'like_new',
  },
  {
    id: 'lst_106',
    sellerId: 'usr_seller_04',
    sellerName: 'Phạm Hồng Quân (23DTH1)',
    sellerPhone: '0933221100',
    title: 'Giáo trình Cơ sở Dữ liệu & SQL Server 2024',
    category: 'textbook',
    price: 50000,
    originalPrice: 70000,
    stock: 2,
    photoUri: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80',
    photoCompressedSizeKb: 250,
    photoOriginalSizeKb: 3800,
    description: 'Đầy đủ bài tập thực hành truy vấn SQL kèm bài giải mẫu.',
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    condition: 'good',
  },
];

let inMemoryListings = [...INITIAL_LISTINGS];
let isSimulatedOffline = false;

export const api = {
  setOfflineMode(offline: boolean) {
    isSimulatedOffline = offline;
    console.log(`[API] Trạng thái mạng: ${offline ? 'OFFLINE' : 'ONLINE'}`);
  },

  isOffline(): boolean {
    return isSimulatedOffline;
  },

  async fetchListings(): Promise<{ listings: Listing[]; isFromCache: boolean; lastUpdated: string }> {
    // Nếu đang chế độ offline giả lập
    if (isSimulatedOffline) {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const lastUpdated = (await AsyncStorage.getItem(LAST_UPDATED_KEY)) || new Date().toLocaleTimeString();
      if (cached) {
        return {
          listings: JSON.parse(cached),
          isFromCache: true,
          lastUpdated,
        };
      }
      return {
        listings: inMemoryListings,
        isFromCache: true,
        lastUpdated,
      };
    }

    // Giả lập network delay 400ms
    await new Promise((r) => setTimeout(r, 400));

    // Lưu vào cache để hỗ trợ offline mode
    const nowStr = new Date().toLocaleTimeString('vi-VN');
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(inMemoryListings));
    await AsyncStorage.setItem(LAST_UPDATED_KEY, nowStr);

    return {
      listings: inMemoryListings,
      isFromCache: false,
      lastUpdated: nowStr,
    };
  },

  async getListingById(id: string): Promise<Listing | null> {
    const found = inMemoryListings.find((l) => l.id === id);
    return found || null;
  },

  async createListing(newListingData: Omit<Listing, 'id' | 'createdAt'>): Promise<Listing> {
    await new Promise((r) => setTimeout(r, 500));
    const created: Listing = {
      ...newListingData,
      id: `lst_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    inMemoryListings = [created, ...inMemoryListings];
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(inMemoryListings));
    return created;
  },

  async updateListingPrice(id: string, newPrice: number): Promise<Listing | null> {
    const item = inMemoryListings.find((l) => l.id === id);
    if (!item) return null;
    item.originalPrice = item.price;
    item.price = newPrice;
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(inMemoryListings));
    return item;
  },

  async updateStock(id: string, delta: number): Promise<boolean> {
    const item = inMemoryListings.find((l) => l.id === id);
    if (!item) return false;
    item.stock = Math.max(0, item.stock + delta);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(inMemoryListings));
    return true;
  },
};
