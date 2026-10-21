import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store';
import { User } from '../types/marketplace';
import { layout, typography } from '../constants/theme';

export default function SignInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const signIn = useAppStore((state) => state.signIn);

  const [email, setEmail] = useState('hai.trinh@dntu.edu.vn');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Trịnh Thế Thanh Hải');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const executeSignIn = async (
    targetEmail = email,
    targetName = name,
    targetRole = role
  ) => {
    if (!targetEmail.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 500));

      const fakeUser: User = {
        id: targetRole === 'seller' ? 'usr_seller_01' : 'usr_buyer_1923050080',
        name: targetName,
        email: targetEmail,
        role: targetRole,
        phone: '0901234567',
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          targetName
        )}&background=0284c7&color=fff`,
      };

      const token = `jwt_campus_marketplace_${targetRole}_${Date.now()}`;
      await signIn(fakeUser, token);
      router.replace('/(app)');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Đăng nhập không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSwitch = (type: 'buyer' | 'seller') => {
    if (type === 'buyer') {
      setEmail('hai.trinh@dntu.edu.vn');
      setName('Trịnh Thế Thanh Hải (Buyer)');
      setRole('buyer');
      executeSignIn('hai.trinh@dntu.edu.vn', 'Trịnh Thế Thanh Hải (Buyer)', 'buyer');
    } else {
      setEmail('minh.seller@dntu.edu.vn');
      setName('Nguyễn Văn Minh (Seller)');
      setRole('seller');
      executeSignIn('minh.seller@dntu.edu.vn', 'Nguyễn Văn Minh (Seller)', 'seller');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Campus Marketplace
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Chợ mua bán & trao đổi đồ dùng sinh viên DNTU
          </Text>
          <Text style={[styles.teamBadge, { color: colors.textMuted }]}>
            Nhóm SV: 1923050080 - 1923050973 - 1923050861
          </Text>
        </View>

        {/* Card Form */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
            Đăng Nhập Tài Khoản
          </Text>

          {errorMsg ? (
            <View
              style={[styles.errorBox, { backgroundColor: colors.errorLight }]}
              accessibilityRole="alert"
            >
              <Text style={[styles.errorText, { color: colors.error }]}>
                ⚠️ {errorMsg}
              </Text>
            </View>
          ) : null}

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Họ và tên
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.borderStrong,
                color: colors.textPrimary,
                minHeight: layout.minTouchTarget,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Nhập họ và tên"
            placeholderTextColor={colors.textMuted}
            accessibilityRole="text"
            accessibilityLabel="Họ và tên sinh viên"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Email trường (@dntu.edu.vn)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.borderStrong,
                color: colors.textPrimary,
                minHeight: layout.minTouchTarget,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="email@dntu.edu.vn"
            placeholderTextColor={colors.textMuted}
            accessibilityRole="text"
            accessibilityLabel="Địa chỉ email trường"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Mật khẩu
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.borderStrong,
                color: colors.textPrimary,
                minHeight: layout.minTouchTarget,
              },
            ]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            accessibilityRole="text"
            accessibilityLabel="Mật khẩu tài khoản"
          />

          {/* Role selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Vai trò trải nghiệm:
          </Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[
                styles.roleBtn,
                {
                  backgroundColor:
                    role === 'buyer' ? colors.primaryLight : colors.surface,
                  borderColor:
                    role === 'buyer' ? colors.primary : colors.border,
                  minHeight: layout.minTouchTarget,
                },
              ]}
              onPress={() => setRole('buyer')}
              accessibilityRole="radio"
              accessibilityLabel="Chọn vai trò Người mua"
            >
              <Text
                style={[
                  styles.roleBtnText,
                  {
                    color:
                      role === 'buyer' ? colors.primaryDark : colors.textMuted,
                  },
                ]}
              >
                🛍️ Người mua (Buyer)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleBtn,
                {
                  backgroundColor:
                    role === 'seller' ? colors.primaryLight : colors.surface,
                  borderColor:
                    role === 'seller' ? colors.primary : colors.border,
                  minHeight: layout.minTouchTarget,
                },
              ]}
              onPress={() => setRole('seller')}
              accessibilityRole="radio"
              accessibilityLabel="Chọn vai trò Người bán"
            >
              <Text
                style={[
                  styles.roleBtnText,
                  {
                    color:
                      role === 'seller' ? colors.primaryDark : colors.textMuted,
                  },
                ]}
              >
                🏷️ Người bán (Seller)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                backgroundColor: colors.primary,
                minHeight: layout.minTouchTarget,
              },
            ]}
            onPress={() => executeSignIn()}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Đăng nhập vào hệ thống"
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={[styles.submitBtnText, { color: colors.textOnPrimary }]}>
                Đăng Nhập
              </Text>
            )}
          </TouchableOpacity>

          {/* Quick accounts for instructor testing */}
          <View style={styles.divider}>
            <View style={[styles.divLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.divText, { color: colors.textMuted }]}>
              Tài khoản kiểm thử nhanh (Viva test)
            </Text>
            <View style={[styles.divLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.quickAccountsRow}>
            <TouchableOpacity
              style={[
                styles.quickBtn,
                {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.primary,
                  minHeight: layout.minTouchTarget,
                },
              ]}
              onPress={() => handleQuickSwitch('buyer')}
              accessibilityRole="button"
              accessibilityLabel="Đăng nhập nhanh vai trò Người mua"
            >
              <Text style={[styles.quickTitle, { color: colors.primaryDark }]}>
                Tài khoản Sinh viên (Buyer)
              </Text>
              <Text style={[styles.quickSub, { color: colors.textMuted }]}>
                Trịnh Thế Thanh Hải - 1923050080
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickBtn,
                {
                  backgroundColor: colors.successLight,
                  borderColor: colors.success,
                  minHeight: layout.minTouchTarget,
                },
              ]}
              onPress={() => handleQuickSwitch('seller')}
              accessibilityRole="button"
              accessibilityLabel="Đăng nhập nhanh vai trò Người bán"
            >
              <Text style={[styles.quickTitle, { color: colors.success }]}>
                Tài khoản Chủ shop (Seller)
              </Text>
              <Text style={[styles.quickSub, { color: colors.textMuted }]}>
                Nguyễn Văn Minh (DNTU K17)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: layout.spacing.lg,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.extrabold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    marginTop: 4,
    textAlign: 'center',
  },
  teamBadge: {
    fontSize: typography.fontSizes.xs,
    marginTop: 8,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: layout.borderRadius.xl,
    padding: layout.spacing.xl,
    borderWidth: 1,
    elevation: 3,
  },
  formTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: layout.spacing.md,
  },
  errorBox: {
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.sm,
    marginBottom: layout.spacing.md,
  },
  errorText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  label: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    fontSize: typography.fontSizes.sm,
    borderWidth: 1,
  },
  roleRow: {
    flexDirection: 'row',
    gap: layout.spacing.sm,
    marginTop: 4,
  },
  roleBtn: {
    flex: 1,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.sm,
  },
  roleBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  submitBtn: {
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: layout.spacing.lg,
  },
  submitBtnText: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: layout.spacing.lg,
  },
  divLine: {
    flex: 1,
    height: 1,
  },
  divText: {
    fontSize: typography.fontSizes.xs - 1,
    marginHorizontal: layout.spacing.sm,
  },
  quickAccountsRow: {
    gap: layout.spacing.sm,
  },
  quickBtn: {
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    padding: layout.spacing.md,
    justifyContent: 'center',
  },
  quickTitle: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  quickSub: {
    fontSize: 10,
    marginTop: 2,
  },
});
