import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '../hooks/useTheme';
import { useAppStore, selectIsAuthenticated } from '../store';
import { layout, typography } from '../constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3, // 3 phút
    },
  },
});

function RootNavLayout() {
  const { colors, isDark } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  const isAuthenticated = useAppStore(selectIsAuthenticated);
  const isRestoringSession = useAppStore((state) => state.isRestoringSession);
  const restoreSession = useAppStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (isRestoringSession) return;
    const inAppGroup = segments[0] === '(app)';

    if (!isAuthenticated && inAppGroup) {
      console.log('[AuthGuard] Chưa đăng nhập -> redirect /sign-in');
      router.replace('/sign-in');
    } else if (isAuthenticated && segments[0] === 'sign-in') {
      console.log('[AuthGuard] Đã đăng nhập -> redirect /(app)');
      router.replace('/(app)');
    }
  }, [isAuthenticated, isRestoringSession, segments, router]);

  if (isRestoringSession) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.splashTitle, { color: colors.primary }]}>
          Campus Marketplace DNTU
        </Text>
        <Text style={[styles.splashSub, { color: colors.textSecondary }]}>
          Đồ án tốt nghiệp môn Lập trình Mobile — 23DTH1
        </Text>
        <Text style={[styles.splashAuthors, { color: colors.textMuted }]}>
          Nhóm: Trịnh Thế Thanh Hải • Bùi Thanh Sơn • Nguyễn Vũ Minh Nhật
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen
          name="+not-found"
          options={{ title: '404 - Không tìm thấy', headerShown: true }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavLayout />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xl,
  },
  splashTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.extrabold,
    marginTop: layout.spacing.lg,
    textAlign: 'center',
  },
  splashSub: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginTop: layout.spacing.xs,
    textAlign: 'center',
  },
  splashAuthors: {
    fontSize: typography.fontSizes.xs,
    marginTop: layout.spacing.md,
    textAlign: 'center',
  },
});
