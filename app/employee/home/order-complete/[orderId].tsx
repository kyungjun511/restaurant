// S-06 주문 완료 (F-08). 뒤로가기를 막고 "내 주문 보기" / "홈으로"로만 이동 (중복 주문 방지)
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, type ReactNode } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/common/Button';
import { Card } from '@/src/components/common/Card';
import { ErrorView } from '@/src/components/common/ErrorView';
import { Loading } from '@/src/components/common/Loading';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { colors } from '@/src/constants/colors';
import { COMMON_MESSAGES } from '@/src/constants/messages';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { useMyOrder } from '@/src/hooks/useMyOrder';

const goHome = () => router.dismissAll(); // 홈 탭 스택의 맨 처음(S-03)으로

const goMyOrders = () => {
  router.dismissAll();
  router.navigate('/employee/orders');
};

export default function OrderCompleteScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: order, isLoading, error, refresh } = useMyOrder(orderId ?? '');

  // Android 뒤로가기 버튼 → 홈으로 (주문하기 화면으로 돌아가지 않게)
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        goHome();
        return true;
      });
      return () => sub.remove();
    }, []),
  );

  const renderBody = () => {
    if (isLoading) return <Loading />;
    if (error || !order) return <ErrorView message="주문을 불러오지 못했어요" onRetry={refresh} />;
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          <Text style={styles.title}>주문을 보냈어요</Text>
          <Text style={styles.sub}>사장님이 확인하면 상태가 바뀌어요</Text>
        </View>

        <Card>
          <SummaryRow label="주문 번호" value={order.orderNo} />
          <SummaryRow label="음식점" value={order.restaurant.name} />
          <SummaryRow label="도착 시간" value={order.arrivalTime} />
          <SummaryRow label="인원" value={`${order.partySize}명`} />
          <SummaryRow label="상태" value={<StatusBadge status={order.status} />} last />
        </Card>
        <Text style={styles.payment}>{COMMON_MESSAGES.paymentOnSite}</Text>

        <View style={styles.actions}>
          <Button title="내 주문 보기" onPress={goMyOrders} />
          <Button title="홈으로" variant="secondary" onPress={goHome} />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* iOS 밀어서 뒤로가기 막기 */}
      <Stack.Screen options={{ gestureEnabled: false }} />
      {renderBody()}
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, last = false }: { label: string; value: ReactNode; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{label}</Text>
      {typeof value === 'string' ? <Text style={styles.rowValue}>{value}</Text> : value}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: layout.screenPadding,
    gap: space.lg,
  },
  hero: {
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.sm,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
  sub: {
    ...typography.sub,
    color: colors.textSub,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: layout.minTouch,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    ...typography.sub,
    color: colors.textSub,
  },
  rowValue: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  payment: {
    ...typography.sub,
    color: colors.textSub,
    textAlign: 'center',
  },
  actions: {
    gap: space.sm,
  },
});
