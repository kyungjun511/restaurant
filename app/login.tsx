// S-01 로그인 (F-01, F-13)
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { SegmentedTab } from '@/src/components/common/SegmentedTab';
import { Select } from '@/src/components/common/Select';
import { colors } from '@/src/constants/colors';
import { getErrorMessage } from '@/src/constants/messages';
import { ROLE_HOME } from '@/src/constants/routes';
import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCompanies } from '@/src/hooks/useCompanies';

type LoginMode = 'employee' | 'staff';

const MODE_TABS: { key: LoginMode; label: string }[] = [
  { key: 'employee', label: '직원' },
  { key: 'staff', label: '음식점·관리자' },
];

export default function LoginScreen() {
  const { user, isRestoring, loginEmployee, loginWithId } = useAuth();
  const companies = useCompanies();

  const [mode, setMode] = useState<LoginMode>('employee');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [employeeNo, setEmployeeNo] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  // 이미 로그인한 상태로 들어오면 유형별 첫 화면으로
  if (!isRestoring && user) return <Redirect href={ROLE_HOME[user.role]} />;

  const canSubmit =
    password.length > 0 &&
    (mode === 'employee' ? companyId !== null && employeeNo.trim().length > 0 : loginId.trim().length > 0);

  // 로그인 방식 탭 전환 시 입력값 초기화
  const changeMode = (next: LoginMode) => {
    if (next === mode) return;
    setMode(next);
    setCompanyId(null);
    setEmployeeNo('');
    setLoginId('');
    setPassword('');
    setError(null);
  };

  const submit = async () => {
    if (!canSubmit || submitting) return;
    Keyboard.dismiss();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'employee') {
        await loginEmployee(companyId as string, employeeNo, password);
      } else {
        await loginWithId(loginId, password);
      }
    } catch (e) {
      setError(getErrorMessage(e));
      setSubmitting(false);
    }
  };

  const clearError = () => {
    if (error) setError(null);
  };

  const companyOptions = (companies.data ?? []).map((c) => ({
    value: c.id,
    label: c.name,
    description: c.location,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={Keyboard.dismiss} accessible={false} style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="restaurant" size={36} color={colors.white} />
            </View>
            <Text style={styles.title}>점심 미리주문</Text>
            <Text style={styles.subtitle}>같은 건물 맛집, 미리 주문하고 바로 식사</Text>
          </Pressable>

          <SegmentedTab items={MODE_TABS} value={mode} onChange={changeMode} />

          <View style={styles.form}>
            {mode === 'employee' ? (
              <>
                <Select
                  label="회사"
                  placeholder={companies.isLoading ? '회사 목록을 불러오는 중이에요' : '회사를 선택해 주세요'}
                  options={companyOptions}
                  value={companyId}
                  onChange={(id) => {
                    setCompanyId(id);
                    clearError();
                  }}
                  disabled={companies.isLoading || companyOptions.length === 0}
                  error={companies.error ? getErrorMessage(companies.error) : null}
                />
                {companies.error ? (
                  <Button title="회사 목록 다시 불러오기" variant="text" onPress={companies.refresh} />
                ) : null}
                <Input
                  label="사번"
                  placeholder="사번을 입력해 주세요"
                  value={employeeNo}
                  onChangeText={(text) => {
                    setEmployeeNo(text);
                    clearError();
                  }}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  invalid={error !== null}
                />
              </>
            ) : (
              <Input
                label="아이디"
                placeholder="아이디를 입력해 주세요"
                value={loginId}
                onChangeText={(text) => {
                  setLoginId(text);
                  clearError();
                }}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                invalid={error !== null}
              />
            )}

            <Input
              ref={passwordRef}
              label="비밀번호"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError();
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={submit}
              error={error}
            />
          </View>

          <Button title="로그인" onPress={submit} disabled={!canSubmit} loading={submitting} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: layout.screenPadding,
    gap: space.xl,
  },
  brand: {
    alignItems: 'center',
    gap: space.sm,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.card * 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginBottom: space.sm,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
  subtitle: {
    ...typography.sub,
    color: colors.textSub,
  },
  form: {
    gap: space.lg,
  },
});
