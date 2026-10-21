import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { layout, typography } from '../constants/theme';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: '404 - Không tìm thấy' }} />
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
        accessibilityRole="alert"
        accessibilityLabel="Màn hình 404 không tìm thấy trang"
      >
        <Text style={[styles.code, { color: colors.primary }]}>404</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Trang bạn tìm kiếm không tồn tại trên hệ thống.
        </Text>
        <Link href="/(app)" asChild>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                minHeight: layout.minTouchTarget,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Quay lại trang chủ sàn Campus Marketplace"
          >
            <Text style={[styles.buttonText, { color: colors.textOnPrimary }]}>
              Về trang chủ Marketplace
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.spacing.xl,
  },
  code: {
    fontSize: 56,
    fontWeight: typography.fontWeights.extrabold,
    marginBottom: layout.spacing.xs,
  },
  title: {
    fontSize: typography.fontSizes.base,
    textAlign: 'center',
    marginBottom: layout.spacing.xl,
  },
  button: {
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
});
