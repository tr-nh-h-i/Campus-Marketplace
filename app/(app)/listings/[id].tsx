import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../hooks/useTheme';
import { Listing, ScreenState } from '../../../types/marketplace';
import { api } from '../../../services/api';
import { schedulePriceDropNotification } from '../../../services/notifications';
import {
  useAppStore,
  selectCurrentUser,
  selectIsFavourite,
} from '../../../store';
import { layout, typography } from '../../../constants/theme';
import { StateView } from '../../../components/StateView';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const currentUser = useAppStore(selectCurrentUser);
  const addToCart = useAppStore((state) => state.addToCart);
  const isFav = useAppStore(selectIsFavourite(id || ''));
  const toggleFavourite = useAppStore((state) => state.toggleFavourite);

  const [listing, setListing] = useState<Listing | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>('loading');

  const fetchDetail = async () => {
    if (!id) {
      setScreenState('empty');
      return;
    }
    setScreenState('loading');
    try {
      const data = await api.getListingById(id);
      if (data) {
        setListing(data);
        setScreenState('content');
      } else {
        setScreenState('empty');
      }
    } catch {
      setScreenState('error');
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAddToCart = () => {
    if (!listing) return;
    const result = addToCart(listing);
    if (Platform.OS === 'web') {
      window.alert(result.message);
    } else {
      Alert.alert(result.success ? 'Thành công' : 'Thông báo', result.message);
    }
  };

  // Demo thay đổi giá để kiểm thử Local Notification cho món hàng yêu thích
  const handleSimulatePriceDrop = async () => {
    if (!listing) return;
    const oldPrice = listing.price;
    const newPrice = Math.max(10000, oldPrice - 20000);

    const updated = await api.updateListingPrice(listing.id, newPrice);
    if (updated) {
      setListing({ ...updated });
      // Kích hoạt local notification
      await schedulePriceDropNotification({
        listingId: listing.id,
        itemTitle: listing.title,
        oldPrice,
        newPrice,
      });
    }
  };

  const isOwner = currentUser?.id === listing?.sellerId;
  const isSellerMode = currentUser?.role === 'seller';
  const isOutOfStock = (listing?.stock || 0) <= 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Bar */}
      <View
        style={[
          styles.headerBar,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backBtn,
            { minWidth: layout.minTouchTarget, minHeight: layout.minTouchTarget },
          ]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Quay lại danh mục"
        >
          <Text style={[styles.backText, { color: colors.primary }]}>← Quay lại</Text>
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          Chi tiết sản phẩm
        </Text>

        <TouchableOpacity
          style={[
            styles.favHeaderBtn,
            { minWidth: layout.minTouchTarget, minHeight: layout.minTouchTarget },
          ]}
          onPress={() => listing && toggleFavourite(listing.id)}
          accessibilityRole="button"
          accessibilityLabel={isFav ? 'Bỏ thích' : 'Yêu thích món đồ này'}
        >
          <Text style={{ fontSize: 20 }}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <StateView
        state={screenState}
        loadingMessage="Đang tải thông tin chi tiết bài đăng..."
        emptyTitle="Không tìm thấy bài đăng này"
        emptyMessage="Bài đăng có thể đã bị xóa hoặc không còn tồn tại trên chợ."
        errorMessage="Không thể kết nối máy chủ để xem chi tiết bài đăng."
        onRetry={fetchDetail}
      >
        {listing && (
          <ScrollView contentContainerStyle={styles.scroll}>
            {/* Main Photo with Compression Proof Badge */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: listing.photoUri }}
                style={styles.detailImage}
                resizeMode="cover"
              />
              <View
                style={[
                  styles.compressionProofBadge,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.proofTitle, { color: colors.primary }]}>
                  ⚡ Bằng chứng nén ảnh Wi-Fi:
                </Text>
                <Text style={[styles.proofDetail, { color: colors.textSecondary }]}>
                  Gốc: {listing.photoOriginalSizeKb || 4200} KB ➔ Sau nén:{' '}
                  {listing.photoCompressedSizeKb || 280} KB (Giảm 93%)
                </Text>
              </View>
            </View>

            {/* Price & Title Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.priceRow}>
                <Text style={[styles.priceText, { color: colors.primary }]}>
                  {listing.price.toLocaleString('vi-VN')} đ
                </Text>
                {listing.originalPrice && listing.originalPrice > listing.price && (
                  <Text style={[styles.oldPrice, { color: colors.textMuted }]}>
                    {listing.originalPrice.toLocaleString('vi-VN')} đ
                  </Text>
                )}
              </View>

              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {listing.title}
              </Text>

              {/* Status and Stock info */}
              <View style={styles.tagsRow}>
                <View
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: isOutOfStock
                        ? colors.errorLight
                        : colors.successLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: isOutOfStock ? colors.error : colors.success },
                    ]}
                  >
                    {isOutOfStock ? '❌ Đã hết hàng' : `📦 Còn ${listing.stock} món`}
                  </Text>
                </View>

                <View
                  style={[styles.tagBadge, { backgroundColor: colors.badgeBg }]}
                >
                  <Text style={[styles.tagText, { color: colors.badgeText }]}>
                    Tình trạng: {listing.condition === 'like_new' ? 'Mới 99%' : 'Tốt'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Seller vs Buyer View (Driven by Role) */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    isOwner || isSellerMode
                      ? colors.primaryLight
                      : colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      isOwner || isSellerMode
                        ? colors.primaryDark
                        : colors.textPrimary,
                  },
                ]}
              >
                {isOwner || isSellerMode
                  ? '🛠️ Bảng điều khiển Người bán (Seller View)'
                  : '👤 Thông tin người bán (Buyer View)'}
              </Text>

              {isOwner || isSellerMode ? (
                <View style={styles.sellerControls}>
                  <Text style={[styles.sellerHint, { color: colors.textSecondary }]}>
                    Bạn đang xem với vai trò Người bán của bài đăng này. Bạn có thể
                    điều chỉnh giá để kiểm thử Local Notification gửi tới người mua:
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.demoPriceBtn,
                      {
                        backgroundColor: colors.primary,
                        minHeight: layout.minTouchTarget,
                      },
                    ]}
                    onPress={handleSimulatePriceDrop}
                    accessibilityRole="button"
                    accessibilityLabel="Mô phỏng giảm giá 20.000 đồng và gửi thông báo"
                  >
                    <Text
                      style={[
                        styles.demoPriceBtnText,
                        { color: colors.textOnPrimary },
                      ]}
                    >
                      🔔 Giảm giá 20.000đ (Kích hoạt Notification)
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.buyerContact}>
                  <Text style={[styles.contactLine, { color: colors.textSecondary }]}>
                    • Họ tên: <Text style={styles.bold}>{listing.sellerName}</Text>
                  </Text>
                  <Text style={[styles.contactLine, { color: colors.textSecondary }]}>
                    • Điện thoại: <Text style={styles.bold}>{listing.sellerPhone || '0901234567'}</Text>
                  </Text>
                  <Text style={[styles.contactLine, { color: colors.textSecondary }]}>
                    • Địa điểm nhận hàng: Cổng 1 trường DNTU hoặc Ký túc xá.
                  </Text>
                </View>
              )}
            </View>

            {/* Description Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Mô tả chi tiết sản phẩm
              </Text>
              <Text style={[styles.descText, { color: colors.textSecondary }]}>
                {listing.description}
              </Text>
            </View>

            {/* Bottom Actions for Buyer */}
            {!isOwner && !isSellerMode && (
              <View style={styles.bottomBar}>
                <TouchableOpacity
                  style={[
                    styles.primaryCartBtn,
                    {
                      backgroundColor: isOutOfStock
                        ? colors.borderStrong
                        : colors.primary,
                      minHeight: layout.minTouchTarget,
                    },
                  ]}
                  onPress={handleAddToCart}
                  disabled={isOutOfStock}
                  accessibilityRole="button"
                  accessibilityLabel="Thêm món đồ này vào giỏ hàng"
                >
                  <Text
                    style={[
                      styles.primaryCartBtnText,
                      { color: colors.textOnPrimary },
                    ]}
                  >
                    {isOutOfStock ? 'Sản phẩm đã hết hàng' : '🛒 Thêm vào giỏ hàng'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </StateView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.xs,
    borderBottomWidth: 1,
  },
  backBtn: {
    justifyContent: 'center',
    paddingHorizontal: layout.spacing.xs,
  },
  backText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  headerTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    maxWidth: 200,
  },
  favHeaderBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 260,
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  compressionProofBadge: {
    position: 'absolute',
    bottom: layout.spacing.sm,
    left: layout.spacing.md,
    right: layout.spacing.md,
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    elevation: 3,
  },
  proofTitle: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  proofDetail: {
    fontSize: 10,
    marginTop: 2,
  },
  card: {
    marginHorizontal: layout.spacing.lg,
    marginTop: layout.spacing.md,
    padding: layout.spacing.lg,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: layout.spacing.sm,
    marginBottom: layout.spacing.xs,
  },
  priceText: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.extrabold,
  },
  oldPrice: {
    fontSize: typography.fontSizes.sm,
    textDecorationLine: 'line-through',
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.lineHeights.relaxed,
    marginBottom: layout.spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: layout.spacing.sm,
  },
  tagBadge: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.sm,
  },
  tagText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    marginBottom: layout.spacing.xs,
  },
  descText: {
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.lineHeights.relaxed,
  },
  sellerControls: {
    marginTop: layout.spacing.xs,
  },
  sellerHint: {
    fontSize: typography.fontSizes.xs,
    lineHeight: typography.lineHeights.normal,
    marginBottom: layout.spacing.sm,
  },
  demoPriceBtn: {
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
  },
  demoPriceBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  buyerContact: {
    gap: 4,
  },
  contactLine: {
    fontSize: typography.fontSizes.xs,
  },
  bold: {
    fontWeight: typography.fontWeights.bold,
  },
  bottomBar: {
    marginHorizontal: layout.spacing.lg,
    marginTop: layout.spacing.xl,
  },
  primaryCartBtn: {
    borderRadius: layout.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryCartBtnText: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },
});
