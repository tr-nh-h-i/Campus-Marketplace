import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { layout, typography } from '../constants/theme';

interface OfflineBannerProps {
  isOffline: boolean;
  lastUpdatedTime: string;
  onToggleOffline?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  lastUpdatedTime,
  onToggleOffline,
}) => {
  const { colors } = useTheme();

  if (!isOffline) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.offlineBannerBg }]}
      accessibilityRole="alert"
      accessibilityLabel={`Chế độ ngoại tuyến, dữ liệu cập nhật lúc ${lastUpdatedTime}`}
    >
      <View style={styles.textColumn}>
        <Text style={[styles.title, { color: colors.offlineBannerText }]}>
          📡 Đang xem danh mục ngoại tuyến (Offline)
        </Text>
        <Text style={[styles.subtitle, { color: colors.offlineBannerText }]}>
          Lần tải thành công gần nhất: {lastUpdatedTime}. Dữ liệu được bảo lưu an toàn.
        </Text>
      </View>
      {onToggleOffline && (
        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: colors.surface }]}
          onPress={onToggleOffline}
          accessibilityRole="button"
          accessibilityLabel="Chuyển sang chế độ trực tuyến"
        >
          <Text style={[styles.toggleBtnText, { color: colors.textPrimary }]}>
            Kết nối lại
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  textColumn: {
    flex: 1,
    paddingRight: layout.spacing.sm,
  },
  title: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  subtitle: {
    fontSize: typography.fontSizes.xs - 1,
    marginTop: 2,
  },
  toggleBtn: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
    minHeight: 32,
    justifyContent: 'center',
  },
  toggleBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
});
