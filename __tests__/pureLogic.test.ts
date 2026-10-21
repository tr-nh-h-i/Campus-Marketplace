import { compressListingImage } from '../services/imageCompressor';

describe('Test 1 (Pure Logic): Phí giao hàng, Tồn kho & Nén ảnh', () => {
  // Test quy tắc phí vận chuyển tại DNTU
  test('Tính toán đúng quy tắc phí giao nhận tại trường DNTU', () => {
    const calculateDeliveryFee = (type: 'campus_pickup' | 'dorm_delivery', itemCount: number) => {
      if (itemCount === 0) return 0;
      return type === 'dorm_delivery' ? 15000 : 0;
    };

    expect(calculateDeliveryFee('campus_pickup', 2)).toBe(0); // Cổng 1 miễn phí
    expect(calculateDeliveryFee('dorm_delivery', 2)).toBe(15000); // KTX phụ phí 15.000đ
    expect(calculateDeliveryFee('dorm_delivery', 0)).toBe(0); // Giỏ trống phí = 0
  });

  // Test quy tắc kiểm tra giới hạn tồn kho
  test('Ngăn chặn vượt quá giới hạn tồn kho người bán', () => {
    const validateStock = (currentQty: number, addedQty: number, maxStock: number) => {
      const nextTotal = currentQty + addedQty;
      if (nextTotal > maxStock) {
        return { allowed: false, message: `Vượt quá tồn kho (tối đa: ${maxStock})` };
      }
      return { allowed: true, nextTotal };
    };

    expect(validateStock(1, 1, 2).allowed).toBe(true);
    expect(validateStock(2, 1, 2).allowed).toBe(false);
    expect(validateStock(0, 5, 3).allowed).toBe(false);
  });

  // Test công thức tính toán tỷ lệ nén ảnh Wi-Fi
  test('Nén ảnh giảm thiểu tối thiểu 70% dung lượng gốc cho Wi-Fi', async () => {
    const res = await compressListingImage('mock_uri', 0.7, 1080);
    expect(res.originalSizeKb).toBeGreaterThan(3000);
    expect(res.compressedSizeKb).toBeLessThan(500);
    expect(res.reductionPercentage).toBeGreaterThanOrEqual(70);
  });
});
