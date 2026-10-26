/**
 * STATE VIEW COMPONENT (4 MANDATORY SCREEN STATES)
 * Module Author: Bùi Thanh Sơn (MSSV: 1923050973)
 * Task: Xử lý 4 trạng thái Loading, Empty, Error kèm Working Retry, và Content
 */
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ScreenState } from '../types/marketplace';
import { layout, typography } from '../constants/theme';

interface StateViewProps {
  state: ScreenState;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const StateView: React.FC<StateViewProps> = ({
  state,
  loadingMessage = 'Đang tải dữ liệu từ server trường DNTU...',
  emptyTitle = 'Chưa có sản phẩm nào',
  emptyMessage = 'Hiện tại không có mục nào phù hợp với tìm kiếm của bạn.',
  errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng.',
  onRetry,
  children,
}) => {
  const { colors } = useTheme();

  // 1. Loading State
  if (state === 'loading') {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        accessibilityRole="progressbar"
        accessibilityLabel={loadingMessage}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {loadingMessage}
        </Text>
      </View>
    );
  }

  // 2. Error State with WORKING RETRY
  if (state === 'error') {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        accessibilityRole="alert"
        accessibilityLabel={`Lỗi: ${errorMessage}`}
      >
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Đã xảy ra sự cố
        </Text>
        <Text style={[styles.desc, { color: colors.textMuted }]}>
          {errorMessage}
        </Text>
        {onRetry && (
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: colors.primary, minHeight: layout.minTouchTarget, minWidth: 120 },
            ]}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Thử tải lại dữ liệu"
          accessibilityHint="Nhấn để thử kết nối lại máy chủ DNTU và tải lại dữ liệu"
          >
            <Text style={[styles.retryText, { color: colors.textOnPrimary }]}>
              🔄 Thử lại
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 3. Empty State
  if (state === 'empty') {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        accessibilityRole="text"
        accessibilityLabel={`${emptyTitle}. ${emptyMessage}`}
      >
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {emptyTitle}
        </Text>
        <Text style={[styles.desc, { color: colors.textMuted }]}>
          {emptyMessage}
        </Text>
        {onRetry && (
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: colors.primaryLight, minHeight: layout.minTouchTarget },
            ]}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Tải lại danh sách"
          >
            <Text style={[styles.retryText, { color: colors.primaryDark }]}>
              Làm mới danh sách
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 4. Content State
  return <>{children}</>;
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xxl,
  },
  loadingText: {
    marginTop: layout.spacing.md,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: layout.spacing.md,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: layout.spacing.md,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: layout.spacing.xs,
  },
  desc: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal,
    marginBottom: layout.spacing.lg,
    maxWidth: 320,
  },
  retryButton: {
    paddingHorizontal: layout.spacing.xl,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
});
