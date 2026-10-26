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
import { layout, typography } from '../constants/theme';
import { SEED_ACCOUNTS } from '../services/authStorage';

type AuthMode = 'sign_in' | 'sign_up';

export default function SignInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const signIn = useAppStore((state) => state.signIn);
  const signUp = useAppStore((state) => state.signUp);

  // Chế độ màn hình: 'sign_in' hoặc 'sign_up'
  const [authMode, setAuthMode] = useState<AuthMode>('sign_in');

  // Form Đăng nhập
  const [loginEmail, setLoginEmail] = useState('hai.trinh@dntu.edu.vn');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Form Đăng ký
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'buyer' | 'seller'>('buyer');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Xử lý ĐĂNG NHẬP
  const handleSignIn = async (overrideEmail?: string, overridePass?: string) => {
    const targetEmail = overrideEmail || loginEmail;
    const targetPass = overridePass || loginPassword;

    if (!targetEmail.trim() || !targetPass.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      await signIn(targetEmail, targetPass);
      router.replace('/(app)');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Đăng nhập không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý ĐĂNG KÝ
  const handleSignUp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email trường DNTU.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        studentId: regStudentId.trim() || undefined,
        phone: regPhone.trim() || undefined,
      });

      setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => {
        router.replace('/(app)');
      }, 500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Đăng ký không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header trường DNTU */}
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
          {/* Tab chuyển đổi Đăng nhập / Đăng ký */}
          <View style={[styles.modeTabRow, { borderColor: colors.border, backgroundColor: colors.inputBackground }]}>
            <TouchableOpacity
              style={[
                styles.modeTabBtn,
                authMode === 'sign_in' && {
                  backgroundColor: colors.primary,
                },
                { minHeight: layout.minTouchTarget },
              ]}
              onPress={() => {
                setAuthMode('sign_in');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              accessibilityRole="tab"
              accessibilityLabel="Chuyển sang Đăng nhập"
            >
              <Text
                style={[
                  styles.modeTabText,
                  {
                    color:
                      authMode === 'sign_in'
                        ? colors.textOnPrimary
                        : colors.textSecondary,
                    fontWeight: authMode === 'sign_in' ? '700' : '500',
                  },
                ]}
              >
                🔐 Đăng Nhập
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeTabBtn,
                authMode === 'sign_up' && {
                  backgroundColor: colors.primary,
                },
                { minHeight: layout.minTouchTarget },
              ]}
              onPress={() => {
                setAuthMode('sign_up');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              accessibilityRole="tab"
              accessibilityLabel="Chuyển sang Đăng ký mới"
            >
              <Text
                style={[
                  styles.modeTabText,
                  {
                    color:
                      authMode === 'sign_up'
                        ? colors.textOnPrimary
                        : colors.textSecondary,
                    fontWeight: authMode === 'sign_up' ? '700' : '500',
                  },
                ]}
              >
                📝 Đăng Ký Mới
              </Text>
            </TouchableOpacity>
          </View>

          {/* Thông báo lỗi */}
          {errorMsg ? (
            <View
              style={[styles.errorBox, { backgroundColor: colors.errorLight, borderColor: colors.error }]}
              accessibilityRole="alert"
            >
              <Text style={[styles.errorText, { color: colors.error }]}>
                ⚠️ {errorMsg}
              </Text>
            </View>
          ) : null}

          {/* Thông báo thành công */}
          {successMsg ? (
            <View
              style={[styles.errorBox, { backgroundColor: colors.successLight, borderColor: colors.success }]}
              accessibilityRole="alert"
            >
              <Text style={[styles.errorText, { color: colors.success }]}>
                ✅ {successMsg}
              </Text>
            </View>
          ) : null}

          {/* ======================================================== */}
          {/* TAB 1: FORM ĐĂNG NHẬP (SIGN IN) */}
          {/* ======================================================== */}
          {authMode === 'sign_in' ? (
            <View>
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
                value={loginEmail}
                onChangeText={setLoginEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="email@dntu.edu.vn"
                placeholderTextColor={colors.textMuted}
                accessibilityRole="text"
                accessibilityLabel="Email đăng nhập"
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
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
                placeholder="Nhập mật khẩu (từ 6 ký tự)"
                placeholderTextColor={colors.textMuted}
                accessibilityRole="text"
                accessibilityLabel="Mật khẩu đăng nhập"
              />

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor: colors.primary,
                    minHeight: layout.minTouchTarget,
                  },
                ]}
                onPress={() => handleSignIn()}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Bấm để đăng nhập"
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.textOnPrimary} />
                ) : (
                  <Text style={[styles.submitText, { color: colors.textOnPrimary }]}>
                    🚀 Đăng Nhập Vào Chợ DNTU
                  </Text>
                )}
              </TouchableOpacity>

              {/* Phân vùng đăng nhập nhanh tài khoản mẫu */}
              <View style={[styles.dividerRow, { borderColor: colors.border }]}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>
                  Hoặc đăng nhập nhanh bằng tài khoản có sẵn
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              <View style={styles.quickAccountsGrid}>
                {SEED_ACCOUNTS.map((acc) => (
                  <TouchableOpacity
                    key={acc.id}
                    style={[
                      styles.quickAccBtn,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        minHeight: layout.minTouchTarget,
                      },
                    ]}
                    onPress={() => {
                      setLoginEmail(acc.email);
                      setLoginPassword(acc.password);
                      handleSignIn(acc.email, acc.password);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Đăng nhập nhanh với tài khoản ${acc.name}`}
                  >
                    <Text style={{ fontSize: 16 }}>
                      {acc.role === 'seller' ? '🏷️' : '🎓'}
                    </Text>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text
                        style={[styles.quickAccName, { color: colors.textPrimary }]}
                        numberOfLines={1}
                      >
                        {acc.name}
                      </Text>
                      <Text style={[styles.quickAccSub, { color: colors.textMuted }]}>
                        {acc.role === 'seller' ? 'Chủ Shop (Bán đồ)' : 'Sinh viên (Mua đồ)'} • {acc.studentId}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.switchLinkBtn, { minHeight: layout.minTouchTarget }]}
                onPress={() => {
                  setAuthMode('sign_up');
                  setErrorMsg('');
                }}
              >
                <Text style={[styles.switchLinkText, { color: colors.primary }]}>
                  Chưa có tài khoản? <Text style={{ fontWeight: '700' }}>Đăng ký tài khoản mới ngay →</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ======================================================== */
            /* TAB 2: FORM ĐĂNG KÝ (SIGN UP) */
            /* ======================================================== */
            <View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Họ và tên sinh viên *
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
                value={regName}
                onChangeText={setRegName}
                placeholder="Ví dụ: Lê Hoàng Nam"
                placeholderTextColor={colors.textMuted}
                accessibilityRole="text"
                accessibilityLabel="Họ và tên sinh viên đăng ký"
              />

              <View style={styles.formRowTwoCol}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Mã số sinh viên (MSSV)
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
                    value={regStudentId}
                    onChangeText={setRegStudentId}
                    placeholder="192305xxxx"
                    placeholderTextColor={colors.textMuted}
                    accessibilityRole="text"
                    accessibilityLabel="Mã số sinh viên"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Số điện thoại liên hệ
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
                    value={regPhone}
                    onChangeText={setRegPhone}
                    keyboardType="phone-pad"
                    placeholder="09xxxxxxxx"
                    placeholderTextColor={colors.textMuted}
                    accessibilityRole="text"
                    accessibilityLabel="Số điện thoại sinh viên"
                  />
                </View>
              </View>

              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Email trường (@dntu.edu.vn) *
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
                value={regEmail}
                onChangeText={setRegEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="nam.le@dntu.edu.vn"
                placeholderTextColor={colors.textMuted}
                accessibilityRole="text"
                accessibilityLabel="Email đăng ký"
              />

              <View style={styles.formRowTwoCol}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Mật khẩu *
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
                    value={regPassword}
                    onChangeText={setRegPassword}
                    secureTextEntry
                    placeholder="Tối thiểu 6 ký tự"
                    placeholderTextColor={colors.textMuted}
                    accessibilityRole="text"
                    accessibilityLabel="Mật khẩu mới"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Xác nhận mật khẩu *
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
                    value={regConfirmPassword}
                    onChangeText={setRegConfirmPassword}
                    secureTextEntry
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor={colors.textMuted}
                    accessibilityRole="text"
                    accessibilityLabel="Xác nhận mật khẩu mới"
                  />
                </View>
              </View>

              {/* Chọn vai trò */}
              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 4 }]}>
                Vai trò chính của tài khoản này:
              </Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[
                    styles.roleBtn,
                    {
                      backgroundColor:
                        regRole === 'buyer' ? colors.primaryLight : colors.surface,
                      borderColor:
                        regRole === 'buyer' ? colors.primary : colors.border,
                      minHeight: layout.minTouchTarget,
                    },
                  ]}
                  onPress={() => setRegRole('buyer')}
                  accessibilityRole="radio"
                  accessibilityLabel="Chọn vai trò Người mua"
                >
                  <Text
                    style={[
                      styles.roleBtnText,
                      {
                        color:
                          regRole === 'buyer' ? colors.primaryDark : colors.textMuted,
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
                        regRole === 'seller' ? colors.primaryLight : colors.surface,
                      borderColor:
                        regRole === 'seller' ? colors.primary : colors.border,
                      minHeight: layout.minTouchTarget,
                    },
                  ]}
                  onPress={() => setRegRole('seller')}
                  accessibilityRole="radio"
                  accessibilityLabel="Chọn vai trò Người bán"
                >
                  <Text
                    style={[
                      styles.roleBtnText,
                      {
                        color:
                          regRole === 'seller' ? colors.primaryDark : colors.textMuted,
                      },
                    ]}
                  >
                    🏷️ Người bán (Seller)
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor: colors.success,
                    minHeight: layout.minTouchTarget,
                  },
                ]}
                onPress={handleSignUp}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Bấm để đăng ký tài khoản"
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.textOnPrimary} />
                ) : (
                  <Text style={[styles.submitText, { color: colors.textOnPrimary }]}>
                    ✨ Tạo Tài Khoản & Bắt Đầu Ngay
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.switchLinkBtn, { minHeight: layout.minTouchTarget }]}
                onPress={() => {
                  setAuthMode('sign_in');
                  setErrorMsg('');
                }}
              >
                <Text style={[styles.switchLinkText, { color: colors.primary }]}>
                  Đã có tài khoản? <Text style={{ fontWeight: '700' }}>Quay lại Đăng nhập →</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: layout.spacing.lg,
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
    marginTop: layout.spacing.xs,
    textAlign: 'center',
  },
  teamBadge: {
    fontSize: typography.fontSizes.xs,
    marginTop: layout.spacing.xs,
    textAlign: 'center',
  },
  card: {
    borderRadius: layout.borderRadius.xl,
    borderWidth: 1,
    padding: layout.spacing.lg,
  },
  modeTabRow: {
    flexDirection: 'row',
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    padding: 3,
    marginBottom: layout.spacing.md,
  },
  modeTabBtn: {
    flex: 1,
    borderRadius: layout.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeTabText: {
    fontSize: typography.fontSizes.sm,
  },
  errorBox: {
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    marginBottom: layout.spacing.md,
  },
  errorText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  label: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: layout.spacing.xs,
    marginTop: layout.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    fontSize: typography.fontSizes.sm,
  },
  formRowTwoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleRow: {
    flexDirection: 'row',
    gap: layout.spacing.sm,
    marginBottom: layout.spacing.sm,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xs,
  },
  roleBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  submitBtn: {
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: layout.spacing.md,
  },
  submitText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: layout.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: typography.fontSizes.xs,
    marginHorizontal: layout.spacing.sm,
  },
  quickAccountsGrid: {
    gap: layout.spacing.xs,
  },
  quickAccBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
  },
  quickAccName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  quickAccSub: {
    fontSize: 10,
  },
  switchLinkBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: layout.spacing.md,
  },
  switchLinkText: {
    fontSize: typography.fontSizes.xs,
  },
});
