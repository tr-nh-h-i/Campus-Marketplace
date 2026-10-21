import { layout, typography, lightColors, darkColors } from '../constants/theme';

describe('Test 2 (Component & Accessibility): Token Theme & Chuẩn WCAG', () => {
  // Test kích thước vùng cảm ứng Accessibility tối thiểu 44 x 44
  test('Chuẩn Touch Target Accessibility đạt tối thiểu 44 x 44 dp', () => {
    expect(layout.minTouchTarget).toBeGreaterThanOrEqual(44);
  });

  // Test sự tồn tại của hệ màu tập trung trong một file token duy nhất
  test('Hệ màu Theme Tokens Light và Dark có cấu trúc đồng nhất 100%', () => {
    const lightKeys = Object.keys(lightColors);
    const darkKeys = Object.keys(darkColors);

    expect(lightKeys.sort()).toEqual(darkKeys.sort());
    expect(lightColors.primary).toBeDefined();
    expect(darkColors.primary).toBeDefined();
    expect(lightColors.background).toBeDefined();
    expect(darkColors.background).toBeDefined();
  });

  // Test độ tương phản tiêu chuẩn chữ
  test('Các phân cấp Typography rõ ràng cho người dùng di động', () => {
    expect(typography.fontSizes.sm).toBeLessThan(typography.fontSizes.base);
    expect(typography.fontSizes.base).toBeLessThan(typography.fontSizes.lg);
    expect(typography.fontWeights.bold).toBe('700');
  });
});
