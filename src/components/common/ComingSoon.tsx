// 임시 화면 틀: 아직 만들지 않은 화면 자리 (해당 단계에서 실제 화면으로 교체)
// 로그아웃이 필요한 화면은 onLogout을 넘기면 확인 모달과 함께 버튼을 보여줌
import { useState, type ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import type Ionicons from '@expo/vector-icons/Ionicons';

import { colors } from '@/src/constants/colors';
import { layout } from '@/src/constants/spacing';
import { Button } from './Button';
import { ConfirmModal } from './ConfirmModal';
import { EmptyState } from './EmptyState';
import { Header } from './Header';

interface ComingSoonProps {
  title: string;                                     // 헤더 제목
  icon: ComponentProps<typeof Ionicons>['name'];
  description: string;                               // 예: "3단계에서 만들어요 (S-03)"
  subtitle?: string;                                 // 로그인 사용자 표시 등
  onLogout?: () => Promise<void>;
}

export function ComingSoon({ title, icon, description, subtitle, onLogout }: ComingSoonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <View style={styles.container}>
      <Header title={title} />
      <EmptyState icon={icon} title={subtitle ?? title} description={description} />
      {onLogout ? (
        <View style={styles.footer}>
          <Button title="로그아웃" variant="secondary" onPress={() => setConfirming(true)} />
          <ConfirmModal
            visible={confirming}
            title="로그아웃할까요?"
            confirmLabel="로그아웃"
            loading={loggingOut}
            onCancel={() => setConfirming(false)}
            onConfirm={async () => {
              setLoggingOut(true);
              await onLogout();
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  footer: {
    padding: layout.screenPadding,
  },
});
