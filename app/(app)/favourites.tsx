import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Listing, ScreenState } from '../../types/marketplace';
import { api } from '../../services/api';
import { schedulePriceDropNotification } from '../../services/notifications';
import { useAppStore, selectFavouriteIds } from '../../store';
import { layout, typography } from '../../constants/theme';
import { ListingCard } from '../../components/ListingCard';
import { StateView } from '../../components/StateView';

export default function FavouritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const favouriteIds = useAppStore(selectFavouriteIds);
  const addToCart = useAppStore((state) => state.addToCart);

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [screenState, setScreenState] = useState<ScreenState>('loading');

  const loadListings = async () => {
    setScreenState('loading');
    try {
      const res = await api.fetchListings();
      setAllListings(res.listings);
      setScreenState('content');
    } catch {
      setScreenState('error');
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  // Lọc các sản phẩm yêu thích (shared state persisted in AsyncStorage)
  const favouriteListings = allListings.filter((item) =>
    favouriteIds.includes(item.id)
  );

  // Kích hoạt mô phỏng giảm giá món hàng yêu thích đầu tiên để test Local Notification
  const handleTestPriceDrop = async () => {
    if (favouriteListings.length === 0) return;
    const target = favouriteListings[0];
    const oldPrice = target.price;
    const newPrice = Math.max(10000, oldPrice - 15000);

    const updated = await api.updateListingPrice(target.id, newPrice);
    if (updated) {
      setAllListings((prev) =>
        prev.map((item) => (item.id === target.id ? updated : item))
      );
      await schedulePriceDropNotification({
        listingId: target.id,
        itemTitle: target.title,
        oldPrice,
        newPrice,
      });
    }
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
          Mục yêu thích ({favouriteListings.length})
        </Text>
        {favouriteListings.length > 0 && (
          <TouchableOpacity
            style={[
              styles.testDropBtn,
              {
                backgroundColor: colors.primaryLight,
                minHeight: layout.minTouchTarget,
              },
            ]}
            onPress={handleTestPriceDrop}
            accessibilityRole="button"
            accessibilityLabel="Mô phỏng giảm giá để thử nghiệm Local Notification"
          >
            <Text style={[styles.testDropText, { color: colors.primaryDark }]}>
              🔔 Thử giảm giá
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <StateView
        state={screenState}
        loadingMessage="Đang tải danh sách mục yêu thích..."
        emptyTitle="Chưa có món đồ yêu thích nào"
        emptyMessage="Hãy nhấn biểu tượng trái tim ❤️ ở danh mục để lưu lại các giáo trình hoặc thiết bị bạn quan tâm."
        errorMessage="Không thể kết nối danh sách yêu thích."
        onRetry={loadListings}
      >
        {favouriteListings.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              Danh sách yêu thích đang trống
            </Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>
              Dữ liệu được đồng bộ bền vững trong Zustand store và AsyncStorage.
            </Text>
            <TouchableOpacity
              style={[
                styles.browseBtn,
                {
                  backgroundColor: colors.primary,
                  minHeight: layout.minTouchTarget,
                },
              ]}
              onPress={() => router.push('/(app)')}
              accessibilityRole="button"
              accessibilityLabel="Duyệt sản phẩm ngay"
            >
              <Text style={[styles.browseBtnText, { color: colors.textOnPrimary }]}>
                Duyệt sản phẩm ngay
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={favouriteListings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text style={[styles.infoTitle, { color: colors.primaryDark }]}>
                  📌 Shared State & Persisted Favourites
                </Text>
                <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>
                  Danh sách này dùng chung với Trang chủ, tồn tại qua các lần khởi
                  động lại app và tự động thông báo khi có sản phẩm giảm giá.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <ListingCard
                listing={item}
                onPress={() => router.push(`/(app)/listings/${item.id}`)}
                onAddToCart={() => addToCart(item)}
              />
            )}
          />
        )}
      </StateView>
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
  testDropBtn: {
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testDropText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  list: {
    padding: layout.spacing.lg,
    paddingBottom: 40,
  },
  infoCard: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    marginBottom: layout.spacing.md,
  },
  infoTitle: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    marginBottom: 2,
  },
  infoDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  emptyBox: {
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
  emptySub: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    marginBottom: layout.spacing.xl,
    lineHeight: typography.lineHeights.normal,
  },
  browseBtn: {
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  browseBtnText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
});
