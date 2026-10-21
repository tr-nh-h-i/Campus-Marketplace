import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore, selectCartTotalCount, selectCurrentUser } from '../../store';
import { layout, typography } from '../../constants/theme';

export default function AppLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, isDark } = useTheme();

  const currentUser = useAppStore(selectCurrentUser);
  const cartTotalCount = useAppStore(selectCartTotalCount);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  // Danh sách các tab chuyển hướng nhanh
  const navTabs = [
    { route: '/(app)', label: 'Chợ DNTU', icon: '🏠' },
    { route: '/(app)/favourites', label: 'Yêu thích', icon: '❤️' },
    { route: '/(app)/create-listing', label: 'Đăng bán', icon: '➕' },
    { route: '/(app)/cart', label: 'Giỏ hàng', icon: '🛒', badge: cartTotalCount },
    { route: '/(app)/profile', label: 'Cá nhân', icon: '👤' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingTop: Platform.OS === 'ios' ? 44 : 12,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.push('/(app)')}
          accessibilityRole="button"
          accessibilityLabel="Trang chủ Campus Marketplace"
        >
          <Text style={[styles.logoText, { color: colors.primary }]}>
            Campus Market
          </Text>
          <Text style={[styles.roleBadge, { color: colors.textMuted }]}>
            {currentUser?.name} ({currentUser?.role === 'seller' ? 'Người bán' : 'Sinh viên'})
          </Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          {/* Theme Toggle Button */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: colors.inputBackground,
                minWidth: layout.minTouchTarget,
                minHeight: layout.minTouchTarget,
              },
            ]}
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          >
            <Text style={{ fontSize: 18 }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          {/* Cart Header Button */}
          <TouchableOpacity
            style={[
              styles.cartBtn,
              {
                backgroundColor: colors.primaryLight,
                minWidth: layout.minTouchTarget,
                minHeight: layout.minTouchTarget,
              },
            ]}
            onPress={() => router.push('/(app)/cart')}
            accessibilityRole="button"
            accessibilityLabel={`Giỏ hàng, hiện có ${cartTotalCount} sản phẩm`}
          >
            <Text style={{ fontSize: 16 }}>🛒</Text>
            {cartTotalCount > 0 && (
              <View
                style={[
                  styles.cartBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[styles.cartBadgeText, { color: colors.textOnPrimary }]}>
                  {cartTotalCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Content Stack */}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="listings/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="create-listing" options={{ presentation: 'modal' }} />
          <Stack.Screen name="cart" />
          <Stack.Screen name="favourites" />
          <Stack.Screen name="profile" />
        </Stack>
      </View>

      {/* Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          },
        ]}
      >
        {navTabs.map((tab) => {
          const isActive = pathname === tab.route;
          return (
            <TouchableOpacity
              key={tab.route}
              style={[
                styles.navTab,
                { minHeight: layout.minTouchTarget },
              ]}
              onPress={() => router.push(tab.route as any)}
              accessibilityRole="tab"
              accessibilityLabel={`${tab.label}${tab.badge ? `, ${tab.badge} mục` : ''}`}
              accessibilityState={{ selected: isActive }}
            >
              <View style={{ position: 'relative' }}>
                <Text style={{ fontSize: 18 }}>{tab.icon}</Text>
                {!!tab.badge && tab.badge > 0 && (
                  <View
                    style={[
                      styles.miniBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.miniBadgeText,
                        { color: colors.textOnPrimary },
                      ]}
                    >
                      {tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.navLabel,
                  {
                    color: isActive ? colors.primary : colors.textMuted,
                    fontWeight: isActive
                      ? typography.fontWeights.bold
                      : typography.fontWeights.normal,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.sm,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extrabold,
  },
  roleBadge: {
    fontSize: typography.fontSizes.xs - 1,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.sm,
  },
  iconBtn: {
    borderRadius: layout.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    position: 'relative',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: layout.borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 6,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  miniBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    borderRadius: layout.borderRadius.full,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniBadgeText: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
  },
});
