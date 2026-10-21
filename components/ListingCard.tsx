import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Listing } from '../types/marketplace';
import { layout, typography } from '../constants/theme';
import { useAppStore, selectIsFavourite, selectCurrentUser } from '../store';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  onAddToCart?: () => void;
  onTogglePriceDrop?: () => void; // Dùng để demo tính năng notification khi đổi giá
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onPress,
  onAddToCart,
}) => {
  const { colors } = useTheme();
  const currentUser = useAppStore(selectCurrentUser);
  const isFav = useAppStore(selectIsFavourite(listing.id));
  const toggleFavourite = useAppStore((state) => state.toggleFavourite);

  const isOwner = currentUser?.id === listing.sellerId;
  const isSellerRole = currentUser?.role === 'seller';
  const hasDiscount =
    listing.originalPrice && listing.originalPrice > listing.price;
  const isOutOfStock = listing.stock <= 0;

  const handleFavoritePress = (e: any) => {
    e.stopPropagation?.();
    toggleFavourite(listing.id);
  };

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Sản phẩm: ${listing.title}, giá: ${listing.price.toLocaleString(
        'vi-VN'
      )} đồng, còn ${listing.stock} món trong kho.`}
    >
      {/* Product Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: listing.photoUri }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite Heart Button (44x44 touch target) */}
        <TouchableOpacity
          style={[
            styles.favButton,
            {
              backgroundColor: colors.surface,
              minWidth: layout.minTouchTarget,
              minHeight: layout.minTouchTarget,
            },
          ]}
          onPress={handleFavoritePress}
          accessibilityRole="button"
          accessibilityLabel={isFav ? 'Bỏ thích sản phẩm này' : 'Thêm vào danh sách yêu thích'}
        >
          <Text style={{ fontSize: 18 }}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Condition Badge */}
        <View
          style={[
            styles.conditionBadge,
            { backgroundColor: colors.badgeBg },
          ]}
        >
          <Text style={[styles.conditionText, { color: colors.badgeText }]}>
            {listing.condition === 'like_new'
              ? 'Mới 99%'
              : listing.condition === 'good'
              ? 'Tốt'
              : 'Đã qua sử dụng'}
          </Text>
        </View>

        {/* Compression proof mini badge */}
        {listing.photoCompressedSizeKb && (
          <View style={[styles.compressBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.compressText, { color: colors.primaryDark }]}>
              ⚡ Đã nén: {listing.photoCompressedSizeKb}KB
            </Text>
          </View>
        )}
      </View>

      {/* Info Container */}
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {listing.title}
        </Text>

        {/* Seller Info */}
        <Text style={[styles.sellerText, { color: colors.textMuted }]}>
          Người bán: {listing.sellerName}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={[styles.currentPrice, { color: colors.primary }]}>
            {listing.price.toLocaleString('vi-VN')} đ
          </Text>
          {hasDiscount && (
            <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
              {listing.originalPrice?.toLocaleString('vi-VN')} đ
            </Text>
          )}
        </View>

        {/* Stock & Action Bar */}
        <View style={styles.footerRow}>
          <View
            style={[
              styles.stockBadge,
              {
                backgroundColor: isOutOfStock
                  ? colors.errorLight
                  : colors.successLight,
              },
            ]}
          >
            <Text
              style={[
                styles.stockText,
                { color: isOutOfStock ? colors.error : colors.success },
              ]}
            >
              {isOutOfStock ? 'Hết hàng' : `Kho: ${listing.stock}`}
            </Text>
          </View>

          {/* Seller view vs Buyer view */}
          {isOwner || isSellerRole ? (
            <View
              style={[
                styles.roleBadge,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Text style={[styles.roleBadgeText, { color: colors.primaryDark }]}>
                {isOwner ? 'Món của bạn' : 'Chế độ Người bán'}
              </Text>
            </View>
          ) : (
            onAddToCart && (
              <TouchableOpacity
                style={[
                  styles.addCartBtn,
                  {
                    backgroundColor: isOutOfStock
                      ? colors.borderStrong
                      : colors.primary,
                    minHeight: layout.minTouchTarget,
                    minWidth: 44,
                  },
                ]}
                onPress={(e) => {
                  e.stopPropagation?.();
                  if (!isOutOfStock) onAddToCart();
                }}
                disabled={isOutOfStock}
                accessibilityRole="button"
                accessibilityLabel="Thêm vào giỏ hàng"
              >
                <Text style={[styles.addCartBtnText, { color: colors.textOnPrimary }]}>
                  + Giỏ
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: layout.spacing.md,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: '#000',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favButton: {
    position: 'absolute',
    top: layout.spacing.sm,
    right: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  conditionBadge: {
    position: 'absolute',
    top: layout.spacing.sm,
    left: layout.spacing.sm,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 3,
    borderRadius: layout.borderRadius.sm,
  },
  conditionText: {
    fontSize: typography.fontSizes.xs - 1,
    fontWeight: typography.fontWeights.bold,
  },
  compressBadge: {
    position: 'absolute',
    bottom: layout.spacing.xs,
    left: layout.spacing.sm,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.sm,
  },
  compressText: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
  },
  content: {
    padding: layout.spacing.md,
  },
  title: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.lineHeights.normal,
    marginBottom: 4,
  },
  sellerText: {
    fontSize: typography.fontSizes.xs,
    marginBottom: layout.spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: layout.spacing.sm,
    marginVertical: 4,
  },
  currentPrice: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extrabold,
  },
  originalPrice: {
    fontSize: typography.fontSizes.xs,
    textDecorationLine: 'line-through',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: layout.spacing.sm,
  },
  stockBadge: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.sm,
  },
  stockText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  addCartBtn: {
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCartBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  roleBadge: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
  },
  roleBadgeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
});
