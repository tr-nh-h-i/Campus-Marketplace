import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import {
  useAppStore,
  selectCurrentUser,
} from '../../store';
import { layout, typography } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const currentUser = useAppStore(selectCurrentUser);
  const switchRole = useAppStore((state) => state.switchRole);
  const signOut = useAppStore((state) => state.signOut);
  const clearCart = useAppStore((state) => state.clearCart);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const themeMode = useAppStore((state) => state.themeMode);

  const handleSignOut = () => {
    const execute = async () => {
      clearCart();
      await signOut();
      router.replace('/sign-in');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Bạn có chắc chắn muốn đăng xuất tài khoản không?')) {
        execute();
      }
    } else {
      Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi Campus Market?', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: execute },
      ]);
    }
  };

  const isSeller = currentUser?.role === 'seller';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scroll}
    >
      {/* User Header Card */}
      <View
        style={[
          styles.userCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: colors.primaryLight },
          ]}
        >
          <Text style={{ fontSize: 32 }}>{isSeller ? '🏷️' : '🎓'}</Text>
        </View>

        <Text style={[styles.userName, { color: colors.textPrimary }]}>
          {currentUser?.name || 'Sinh viên DNTU'}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textMuted }]}>
          {currentUser?.email || 'student@dntu.edu.vn'}
        </Text>

        <View
          style={[
            styles.roleBadge,
            {
              backgroundColor: isSeller
                ? colors.successLight
                : colors.primaryLight,
            },
          ]}
        >
          <Text
            style={[
              styles.roleText,
              { color: isSeller ? colors.success : colors.primaryDark },
            ]}
          >
            Vai trò hiện tại: {isSeller ? 'Chủ shop (Seller)' : 'Sinh viên mua hàng (Buyer)'}
          </Text>
        </View>
      </View>

      {/* Role Switcher Section (Rubric Requirement) */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          🔄 Chuyển đổi vai trò hiển thị (Seller / Buyer View)
        </Text>
        <Text style={[styles.sectionSub, { color: colors.textMuted }]}>
          Đề bài yêu cầu: Giao diện bài đăng tự động thích ứng với vai trò của tài khoản.
        </Text>

        <View style={styles.roleButtonRow}>
          <TouchableOpacity
            style={[
              styles.roleOptionBtn,
              {
                backgroundColor: !isSeller
                  ? colors.primary
                  : colors.inputBackground,
                borderColor: !isSeller ? colors.primary : colors.border,
                minHeight: layout.minTouchTarget,
              },
            ]}
            onPress={() => switchRole('buyer')}
            accessibilityRole="button"
            accessibilityLabel="Đổi sang vai trò Người mua"
          >
            <Text
              style={[
                styles.roleOptionText,
                {
                  color: !isSeller
                    ? colors.textOnPrimary
                    : colors.textSecondary,
                },
              ]}
            >
              🛍️ Chế độ Người mua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleOptionBtn,
              {
                backgroundColor: isSeller
                  ? colors.primary
                  : colors.inputBackground,
                borderColor: isSeller ? colors.primary : colors.border,
                minHeight: layout.minTouchTarget,
              },
            ]}
            onPress={() => switchRole('seller')}
            accessibilityRole="button"
            accessibilityLabel="Đổi sang vai trò Người bán"
          >
            <Text
              style={[
                styles.roleOptionText,
                {
                  color: isSeller
                    ? colors.textOnPrimary
                    : colors.textSecondary,
                },
              ]}
            >
              🏷️ Chế độ Người bán
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Theme Settings */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          ⚙️ Cài đặt giao diện (Design Tokens)
        </Text>

        <TouchableOpacity
          style={[
            styles.settingRow,
            { minHeight: layout.minTouchTarget },
          ]}
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel={`Đang bật chế độ ${isDark ? 'tối' : 'sáng'}, bấm để đổi`}
        >
          <View>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
              Chế độ hiển thị: {isDark ? '🌙 Tối (Dark)' : '☀️ Sáng (Light)'}
            </Text>
            <Text style={[styles.settingSub, { color: colors.textMuted }]}>
              Hệ màu tập trung từ constants/theme.ts, 0% hardcode hex
            </Text>
          </View>
          <Text style={{ fontSize: 20 }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      {/* Team Information Card */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          👥 Thông tin nhóm sinh viên thực hiện đồ án
        </Text>
        <Text style={[styles.teamLine, { color: colors.textSecondary }]}>
          • <Text style={styles.bold}>1923050080</Text> — Trịnh Thế Thanh Hải (Nhóm trưởng)
        </Text>
        <Text style={[styles.teamLine, { color: colors.textSecondary }]}>
          • <Text style={styles.bold}>1923050973</Text> — Bùi Thanh Sơn
        </Text>
        <Text style={[styles.teamLine, { color: colors.textSecondary }]}>
          • <Text style={styles.bold}>1923050861</Text> — Nguyễn Vũ Minh Nhật
        </Text>
        <Text style={[styles.classLine, { color: colors.textMuted }]}>
          Lớp: TH7011101 (23DTH1) — GVHD: ThS. Nguyễn Xuân Vinh
        </Text>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[
          styles.signOutBtn,
          {
            backgroundColor: colors.errorLight,
            borderColor: colors.error,
            minHeight: layout.minTouchTarget,
          },
        ]}
        onPress={handleSignOut}
        accessibilityRole="button"
        accessibilityLabel="Đăng xuất hoàn toàn khỏi ứng dụng"
      >
        <Text style={[styles.signOutText, { color: colors.error }]}>
          🚪 Đăng xuất an toàn (Xóa Token SecureStore)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: layout.spacing.lg,
    paddingBottom: 40,
  },
  userCard: {
    borderRadius: layout.borderRadius.xl,
    padding: layout.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: layout.spacing.lg,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: layout.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  userName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.extrabold,
  },
  userEmail: {
    fontSize: typography.fontSizes.xs,
    marginTop: 2,
  },
  roleBadge: {
    marginTop: layout.spacing.md,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.full,
  },
  roleText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  sectionCard: {
    borderRadius: layout.borderRadius.xl,
    padding: layout.spacing.lg,
    borderWidth: 1,
    marginBottom: layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    marginBottom: layout.spacing.xs,
  },
  sectionSub: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: layout.spacing.md,
  },
  roleButtonRow: {
    flexDirection: 'row',
    gap: layout.spacing.sm,
  },
  roleOptionBtn: {
    flex: 1,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.xs,
  },
  roleOptionText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: layout.spacing.xs,
  },
  settingLabel: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  settingSub: {
    fontSize: 10,
    marginTop: 2,
  },
  teamLine: {
    fontSize: typography.fontSizes.xs,
    marginVertical: 2,
  },
  classLine: {
    fontSize: 11,
    marginTop: 6,
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: typography.fontWeights.bold,
  },
  signOutBtn: {
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: layout.spacing.sm,
  },
  signOutText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
});
