/**
 * MARKETPLACE HOME SCREEN (CATALOG & SEARCH)
 * Module Author: Bùi Thanh Sơn (MSSV: 1923050973)
 * Task: Thiết kế bộ lọc danh mục & thanh tìm kiếm tính toán trực tiếp trong render (useMemo)
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Listing, ProductCategory, ScreenState } from '../../types/marketplace';
import { api } from '../../services/api';
import { useAppStore } from '../../store';
import { layout, typography } from '../../constants/theme';
import { ListingCard } from '../../components/ListingCard';
import { OfflineBanner } from '../../components/OfflineBanner';
import { StateView } from '../../components/StateView';

export default function MarketplaceHomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const addToCart = useAppStore((state) => state.addToCart);

  // Raw State từ API
  const [listings, setListings] = useState<Listing[]>([]);
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Vừa xong');

  // Filter & Search Raw Inputs
  // QUY TẮC ĐỀ BÀI BẮT BUỘC:
  // "Category filter plus text search, both computed during render, never stored as derived state."
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');

  const categories: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'textbook', label: '📚 Giáo trình' },
    { key: 'electronics', label: '💻 Thiết bị' },
    { key: 'stationery', label: '✏️ Dụng cụ' },
    { key: 'dorm_supplies', label: '🛏️ Đồ KTX' },
    { key: 'clothing', label: '👕 Trang phục' },
  ];

  // Tải danh sách sản phẩm từ API (có fallback sang offline cache)
  const loadData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setScreenState('loading');
    try {
      const res = await api.fetchListings();
      setListings(res.listings);
      setIsOffline(res.isFromCache);
      setLastUpdatedTime(res.lastUpdated);
      setScreenState(res.listings.length > 0 ? 'content' : 'empty');
    } catch {
      setScreenState('error');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData(true);
  };

  const handleToggleOffline = () => {
    const next = !api.isOffline();
    api.setOfflineMode(next);
    setIsOffline(next);
    loadData();
  };

  // =========================================================================
  // BẮT BUỘC: Category filter + text search TÍNH TOÁN TRỰC TIẾP KHI RENDER
  // (computed during render via useMemo, không lưu state dẫn xuất!)
  // =========================================================================
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [listings, searchQuery, selectedCategory]);

  const handleAddToCart = (listing: Listing) => {
    const result = addToCart(listing);
    const msg = result.message;
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert(result.success ? 'Thành công' : 'Thông báo', msg);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Offline Banner với mốc thời gian cập nhật */}
      <OfflineBanner
        isOffline={isOffline}
        lastUpdatedTime={lastUpdatedTime}
        onToggleOffline={handleToggleOffline}
      />

      {/* Search Bar & Filter Section */}
      <View
        style={[
          styles.filterHeader,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        {/* Search Input */}
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.borderStrong,
              minHeight: layout.minTouchTarget,
            },
          ]}
        >
          <Text style={{ fontSize: 16, marginRight: layout.spacing.xs }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Tìm giáo trình, máy tính, quạt KTX, áo..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityRole="search"
            accessibilityLabel="Ô tìm kiếm sản phẩm"
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={[styles.clearBtn, { minWidth: 32, minHeight: 32 }]}
              accessibilityRole="button"
              accessibilityLabel="Xóa từ khóa tìm kiếm"
            >
              <Text style={{ color: colors.textMuted, fontSize: 14 }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Horizontal Scroll Chips */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.key;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.inputBackground,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.border,
                    minHeight: 36,
                  },
                ]}
                onPress={() => setSelectedCategory(item.key)}
                accessibilityRole="button"
                accessibilityLabel={`Lọc danh mục ${item.label}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: isSelected
                        ? colors.textOnPrimary
                        : colors.textSecondary,
                      fontWeight: isSelected
                        ? typography.fontWeights.bold
                        : typography.fontWeights.medium,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Main Content với 4 trạng thái chuẩn StateView */}
      <StateView
        state={screenState}
        loadingMessage="Đang tải danh mục Campus Marketplace DNTU..."
        emptyTitle="Không tìm thấy bài đăng"
        emptyMessage="Không có món đồ nào khớp với bộ lọc hoặc từ khóa tìm kiếm."
        errorMessage="Không thể kết nối máy chủ chợ DNTU. Hãy thử lại hoặc chuyển sang chế độ Offline."
        onRetry={() => loadData(false)}
      >
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <View style={styles.listSummary}>
              <Text style={[styles.summaryText, { color: colors.textMuted }]}>
                Hiển thị {filteredListings.length} bài đăng • Kéo xuống để làm mới (Cập nhật: {lastUpdatedTime})
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => router.push(`/(app)/listings/${item.id}`)}
              onAddToCart={() => handleAddToCart(item)}
            />
          )}
        />
      </StateView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterHeader: {
    paddingHorizontal: layout.spacing.lg,
    paddingTop: layout.spacing.sm,
    paddingBottom: layout.spacing.sm,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    paddingVertical: layout.spacing.xs,
  },
  clearBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryList: {
    paddingVertical: layout.spacing.sm,
    gap: layout.spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.xs,
  },
  chipText: {
    fontSize: typography.fontSizes.xs,
  },
  listContent: {
    padding: layout.spacing.lg,
    paddingBottom: layout.spacing.xxl,
  },
  listSummary: {
    marginBottom: layout.spacing.sm,
  },
  summaryText: {
    fontSize: typography.fontSizes.xs - 1,
  },
});
