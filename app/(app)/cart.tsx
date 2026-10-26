import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import {
  useAppStore,
  selectCurrentUser,
  selectCartTotalCount,
  selectCartSubtotal,
  selectCartDeliveryFee,
  selectCartFinalTotal,
} from '../../store';
import { api } from '../../services/api';
import { saveUserOrder } from '../../services/authStorage';
import { layout, typography } from '../../constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const currentUser = useAppStore(selectCurrentUser);
  const cartItems = useAppStore((state) => state.cartItems);
  const deliveryType = useAppStore((state) => state.deliveryType);
  const setDeliveryType = useAppStore((state) => state.setDeliveryType);
  const updateQuantity = useAppStore((state) => state.updateQuantity);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const clearCart = useAppStore((state) => state.clearCart);

  // Derived Values từ Selectors
  const totalCount = useAppStore(selectCartTotalCount);
  const subtotal = useAppStore(selectCartSubtotal);
  const deliveryFee = useAppStore(selectCartDeliveryFee);
  const finalTotal = useAppStore(selectCartFinalTotal);

  const handleUpdateQty = (listingId: string, targetQty: number) => {
    const res = updateQuantity(listingId, targetQty);
    if (!res.success) {
      if (Platform.OS === 'web') window.alert(res.message);
      else Alert.alert('Thông báo kho', res.message);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const deliveryNote =
      deliveryType === 'campus_pickup'
        ? 'Nhận trực tiếp tại Cổng 1 DNTU (Miễn phí)'
        : 'Giao tận phòng Ký túc xá DNTU (+15.000đ)';

    const orderId = `DNTU-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Trừ số lượng tồn kho thực tế trong CSDL
    await api.deductStockForOrder(
      cartItems.map((item) => ({
        listingId: item.listingId,
        quantity: item.quantity,
      }))
    );

    // 2. Lưu đơn hàng vào CSDL riêng của User
    if (currentUser?.id) {
      const orderRecord = {
        id: orderId,
        userId: currentUser.id,
        userName: currentUser.name,
        userPhone: currentUser.phone || '0901234567',
        studentId: currentUser.studentId || '1923050080',
        items: [...cartItems],
        subtotal,
        deliveryFee,
        deliveryType,
        deliveryNote,
        total: finalTotal,
        status: 'Đã xác nhận (Đang chuẩn bị sách)',
        createdAt: new Date().toLocaleString('vi-VN'),
      };
      await saveUserOrder(currentUser.id, orderRecord);
    }

    const msg = `Đặt hàng thành công! 🎉\n\n• Mã đơn: #${orderId}\n• Số món: ${totalCount} cuốn\n• Hình thức: ${deliveryNote}\n• Tổng thanh toán: ${finalTotal.toLocaleString(
      'vi-VN'
    )} đ\n\nNgười bán sẽ liên hệ qua SĐT ${currentUser?.phone || ''} để bàn giao sách!`;

    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('Đặt hàng thành công 🎉', msg);
    }
    clearCart();
    router.push('/(app)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Giỏ hàng của bạn ({totalCount})
        </Text>
        {cartItems.length > 0 && (
          <TouchableOpacity
            style={[styles.clearBtn, { minHeight: layout.minTouchTarget }]}
            onPress={clearCart}
            accessibilityRole="button"
            accessibilityLabel="Xóa toàn bộ giỏ hàng"
          >
            <Text style={[styles.clearText, { color: colors.error }]}>
              Xóa tất cả
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Content */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            Giỏ hàng của bạn đang trống
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            Hãy dạo quanh Campus Market để tìm giáo trình và đồ dùng cần thiết nhé!
          </Text>
          <TouchableOpacity
            style={[
              styles.shopBtn,
              {
                backgroundColor: colors.primary,
                minHeight: layout.minTouchTarget,
              },
            ]}
            onPress={() => router.push('/(app)')}
            accessibilityRole="button"
            accessibilityLabel="Đi đến trang chợ sinh viên DNTU"
          >
            <Text style={[styles.shopBtnText, { color: colors.textOnPrimary }]}>
              Khám phá đồ dùng DNTU
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.listingId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isAtMaxStock = item.quantity >= item.listing.stock;
            return (
              <View
                style={[
                  styles.itemCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Image
                  source={{ uri: item.listing.photoUri }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text
                    style={[styles.itemTitle, { color: colors.textPrimary }]}
                    numberOfLines={2}
                  >
                    {item.listing.title}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.primary }]}>
                    {item.listing.price.toLocaleString('vi-VN')} đ
                  </Text>

                  {/* Stock Constraint Notice */}
                  <Text
                    style={[
                      styles.stockNotice,
                      {
                        color: isAtMaxStock
                          ? colors.warning
                          : colors.textMuted,
                      },
                    ]}
                  >
                    {isAtMaxStock
                      ? `⚠️ Đạt tối đa kho người bán (${item.listing.stock})`
                      : `Còn lại trong kho: ${item.listing.stock}`}
                  </Text>
                </View>

                {/* Controls */}
                <View style={styles.itemActions}>
                  <View
                    style={[
                      styles.qtyBox,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.qtyBtn,
                        { minWidth: 32, minHeight: 32 },
                      ]}
                      onPress={() =>
                        handleUpdateQty(item.listingId, item.quantity - 1)
                      }
                      accessibilityRole="button"
                      accessibilityLabel="Giảm số lượng"
                    >
                      <Text style={[styles.qtyBtnText, { color: colors.textPrimary }]}>
                        -
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.qtyText, { color: colors.textPrimary }]}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.qtyBtn,
                        { minWidth: 32, minHeight: 32 },
                      ]}
                      onPress={() =>
                        handleUpdateQty(item.listingId, item.quantity + 1)
                      }
                      disabled={isAtMaxStock}
                      accessibilityRole="button"
                      accessibilityLabel="Tăng số lượng"
                    >
                      <Text
                        style={[
                          styles.qtyBtnText,
                          {
                            color: isAtMaxStock
                              ? colors.borderStrong
                              : colors.textPrimary,
                          },
                        ]}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.deleteBtn,
                      { minWidth: 32, minHeight: 32 },
                    ]}
                    onPress={() => removeFromCart(item.listingId)}
                    accessibilityRole="button"
                    accessibilityLabel="Xóa sản phẩm khỏi giỏ hàng"
                  >
                    <Text style={{ fontSize: 13, color: colors.error }}>✕ Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            <View style={styles.footerContainer}>
              {/* Delivery Rules Section */}
              <View
                style={[
                  styles.deliveryCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  📍 Quy tắc giao nhận tại DNTU
                </Text>

                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    {
                      borderColor:
                        deliveryType === 'campus_pickup'
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        deliveryType === 'campus_pickup'
                          ? colors.primaryLight
                          : colors.surface,
                      minHeight: layout.minTouchTarget,
                    },
                  ]}
                  onPress={() => setDeliveryType('campus_pickup')}
                  accessibilityRole="radio"
                  accessibilityLabel="Nhận trực tiếp tại Cổng 1 DNTU, miễn phí"
                >
                  <Text style={{ fontSize: 18 }}>🏫</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.radioTitle,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Nhận tại Cổng 1 ĐH Công nghệ Đồng Nai
                    </Text>
                    <Text style={[styles.radioSub, { color: colors.textMuted }]}>
                      Miễn phí nhận hàng trực tiếp
                    </Text>
                  </View>
                  <Text style={[styles.radioPrice, { color: colors.success }]}>
                    0 đ
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    {
                      borderColor:
                        deliveryType === 'dorm_delivery'
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        deliveryType === 'dorm_delivery'
                          ? colors.primaryLight
                          : colors.surface,
                      minHeight: layout.minTouchTarget,
                    },
                  ]}
                  onPress={() => setDeliveryType('dorm_delivery')}
                  accessibilityRole="radio"
                  accessibilityLabel="Giao tận phòng Ký túc xá DNTU, phụ phí 15.000 đồng"
                >
                  <Text style={{ fontSize: 18 }}>🛏️</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.radioTitle,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Giao tận phòng Ký túc xá DNTU
                    </Text>
                    <Text style={[styles.radioSub, { color: colors.textMuted }]}>
                      Giao tận tay trong ngày
                    </Text>
                  </View>
                  <Text style={[styles.radioPrice, { color: colors.primary }]}>
                    +15.000 đ
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Summary Calculations */}
              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Tóm tắt đơn hàng (Checkout Summary)
                </Text>

                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
                    Tạm tính ({totalCount} món):
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                    {subtotal.toLocaleString('vi-VN')} đ
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
                    Phí giao nhận:
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                    {deliveryFee === 0
                      ? 'Miễn phí'
                      : `${deliveryFee.toLocaleString('vi-VN')} đ`}
                  </Text>
                </View>

                <View
                  style={[styles.divLine, { backgroundColor: colors.border }]}
                />

                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
                    Tổng thanh toán:
                  </Text>
                  <Text style={[styles.totalValue, { color: colors.primary }]}>
                    {finalTotal.toLocaleString('vi-VN')} đ
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.checkoutBtn,
                    {
                      backgroundColor: colors.primary,
                      minHeight: layout.minTouchTarget,
                    },
                  ]}
                  onPress={handleCheckout}
                  accessibilityRole="button"
                  accessibilityLabel={`Xác nhận đặt hàng với tổng tiền ${finalTotal} đồng`}
                >
                  <Text
                    style={[
                      styles.checkoutBtnText,
                      { color: colors.textOnPrimary },
                    ]}
                  >
                    Xác Nhận Đặt Hàng ({finalTotal.toLocaleString('vi-VN')} đ)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  clearBtn: {
    justifyContent: 'center',
  },
  clearText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  list: {
    padding: layout.spacing.lg,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
    borderWidth: 1,
    marginBottom: layout.spacing.md,
    alignItems: 'center',
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: layout.borderRadius.md,
    marginRight: layout.spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  itemPrice: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.extrabold,
    marginTop: 2,
  },
  stockNotice: {
    fontSize: 10,
    marginTop: 2,
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 6,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1,
  },
  qtyBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: typography.fontWeights.bold,
  },
  qtyText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    minWidth: 18,
    textAlign: 'center',
  },
  deleteBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    marginTop: layout.spacing.md,
  },
  deliveryCard: {
    borderRadius: layout.borderRadius.xl,
    padding: layout.spacing.lg,
    borderWidth: 1,
    marginBottom: layout.spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    marginBottom: layout.spacing.md,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    padding: layout.spacing.md,
    gap: layout.spacing.sm,
    marginBottom: layout.spacing.xs,
  },
  radioTitle: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  radioSub: {
    fontSize: 10,
  },
  radioPrice: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.extrabold,
  },
  summaryCard: {
    borderRadius: layout.borderRadius.xl,
    padding: layout.spacing.lg,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: typography.fontSizes.xs,
  },
  summaryValue: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  divLine: {
    height: 1,
    marginVertical: layout.spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  totalLabel: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  totalValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.extrabold,
  },
  checkoutBtn: {
    borderRadius: layout.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: layout.spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: layout.spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    marginBottom: layout.spacing.xl,
    lineHeight: typography.lineHeights.normal,
  },
  shopBtn: {
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopBtnText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
});
