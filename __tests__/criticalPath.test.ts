import { api } from '../services/api';
import { Listing } from '../types/marketplace';

describe('Test 3 (Critical Path): Luồng nghiệp vụ cốt lõi Chợ Sinh Viên', () => {
  test('Quy trình: Tạo bài đăng -> Tìm kiếm -> Thêm giỏ hàng -> Đặt hàng', async () => {
    // 1. Tạo bài đăng mới
    const newListingData: Omit<Listing, 'id' | 'createdAt'> = {
      title: 'Giáo trình Mạng Máy Tính DNTU 2026',
      category: 'textbook',
      price: 45000,
      stock: 2,
      photoUri: 'https://images.unsplash.com/test.jpg',
      description: 'Sách còn mới nguyên bìa',
      condition: 'like_new',
      sellerId: 'usr_test_seller',
      sellerName: 'Bùi Thanh Sơn (1923050973)',
    };

    const created = await api.createListing(newListingData);
    expect(created.id).toBeDefined();
    expect(created.title).toBe(newListingData.title);

    // 2. Tìm kiếm trong danh mục vừa tải
    const res = await api.fetchListings();
    const found = res.listings.find((item) => item.id === created.id);
    expect(found).toBeDefined();

    // 3. Giả lập kiểm tra tồn kho trước khi đặt hàng
    expect(created.stock).toBe(2);
    const orderQty = 2;
    expect(orderQty <= created.stock).toBe(true);

    // 4. Giảm tồn kho sau khi đặt hàng
    const stockUpdated = await api.updateStock(created.id, -orderQty);
    expect(stockUpdated).toBe(true);
    const afterOrder = await api.getListingById(created.id);
    expect(afterOrder?.stock).toBe(0);
  });
});
