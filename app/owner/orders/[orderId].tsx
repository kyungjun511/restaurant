// S-10 주문 상세 (F-07, F-16, F-17)
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Banner } from '@/src/components/common/Banner';
import { BottomBar } from '@/src/components/common/BottomBar';
import { BottomSheet } from '@/src/components/common/BottomSheet';
import { Button } from '@/src/components/common/Button';
import { ConfirmModal } from '@/src/components/common/ConfirmModal';
import { ErrorView } from '@/src/components/common/ErrorView';
import { Header } from '@/src/components/common/Header';
import { Loading } from '@/src/components/common/Loading';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { colors } from '@/src/constants/colors';
import { getErrorMessage } from '@/src/constants/messages';
import { REJECT_REASON_LABEL, REJECT_REASONS } from '@/src/constants/orderStatus';
import { layout, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { useOwnerOrder } from '@/src/hooks/useOwnerOrder';
import { useTimedBanner } from '@/src/hooks/useTimedBanner';
import type { Order, OwnerNextStatus, RejectReason } from '@/src/types/models';
import { formatPrice } from '@/src/utils/format';
import { ordererName } from '@/src/utils/orderText';

// 한 번에 다음 단계로 가는 버튼 (주문 수락 → 준비 중 → 준비 완료 → 제공 완료)
const NEXT_STEP: Partial<Record<Order['status'], { status: OwnerNextStatus; label: string; done: string }>> = {
  accepted: { status: 'preparing', label: '준비 시작', done: '준비를 시작했어요' },
  preparing: { status: 'ready', label: '준비 완료', done: '준비 완료로 바꿨어요' },
  ready: { status: 'served', label: '제공 완료', done: '제공 완료로 바꿨어요' },
};

export default function OwnerOrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: order, isLoading, error, refresh, pending, accept, reject, changeStatus } = useOwnerOrder(
    orderId ?? '',
  );
  const { banner, show } = useTimedBanner();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState<RejectReason | null>(null);
  const [noShowOpen, setNoShowOpen] = useState(false);

  const goBack = () => router.back();

  // 처리 실패 → 빨간 띠 + 최신 상태 다시 받기 (예: 그 사이 직원이 취소)
  const run = async (action: () => Promise<unknown>, successMessage: string) => {
    try {
      await action();
      show('success', successMessage);
      return true;
    } catch (e) {
      show('error', getErrorMessage(e) || '처리하지 못했어요. 다시 시도해 주세요');
      void refresh();
      return false;
    }
  };

  if (isLoading || !order) {
    return (
      <View style={styles.container}>
        <Header title="주문 상세" onBack={goBack} />
        {isLoading ? <Loading /> : <ErrorView message={getErrorMessage(error)} onRetry={refresh} />}
      </View>
    );
  }

  const next = NEXT_STEP[order.status];
  const busy = pending !== null;

  const renderActions = () => {
    if (order.status === 'requested') {
      return (
        <View style={styles.actionRow}>
          <Button
            title="거절"
            variant="secondary"
            size="large"
            disabled={busy}
            onPress={() => {
              setRejectReason(null);
              setRejectOpen(true);
            }}
            style={styles.rejectButton}
          />
          <Button
            title="수락"
            size="large"
            loading={pending === 'accept'}
            disabled={busy}
            onPress={() => run(accept, '수락했어요')}
            style={styles.acceptButton}
          />
        </View>
      );
    }
    if (next) {
      return (
        <>
          <Button
            title={next.label}
            size="large"
            loading={pending === next.status}
            disabled={busy}
            onPress={() => run(() => changeStatus(next.status), next.done)}
          />
          {order.status === 'ready' ? (
            <Button
              title="노쇼 처리"
              variant="danger"
              size="small"
              disabled={busy}
              onPress={() => setNoShowOpen(true)}
              style={styles.noShow}
            />
          ) : null}
        </>
      );
    }
    return null;
  };

  const actions = renderActions();

  return (
    <View style={styles.container}>
      <Header title={`주문 ${order.orderNo}`} onBack={goBack} right={<StatusBadge status={order.status} />} />
      {banner ? <Banner type={banner.type} message={banner.message} /> : null}

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.arrival}>{order.arrivalTime} 도착</Text>
          <View style={styles.people}>
            <Ionicons name="people-outline" size={20} color={colors.text} />
            <Text style={styles.ownerBody}>{order.partySize}명</Text>
          </View>
        </View>

        <View style={[styles.section, styles.row]}>
          <Text style={styles.label}>주문자</Text>
          <Text style={styles.ownerBodyStrong}>{ordererName(order)}</Text>
        </View>

        <View style={styles.section}>
          {order.items.map((item) => (
            <View key={item.menuId} style={styles.row}>
              <Text style={[styles.ownerBody, styles.flex]}>{item.menuName}</Text>
              <Text style={styles.ownerBodyStrong}>× {item.quantity}</Text>
            </View>
          ))}
        </View>

        {order.requestNote ? (
          <View style={styles.section}>
            <Text style={styles.label}>요청사항</Text>
            <Text style={styles.ownerBody}>{order.requestNote}</Text>
          </View>
        ) : null}

        <View style={[styles.section, styles.row]}>
          <Text style={styles.label}>합계</Text>
          <Text style={styles.ownerBodyStrong}>{formatPrice(order.totalPrice)} · 현장 결제</Text>
        </View>

        {/* 처리가 끝난 주문은 버튼 대신 결과만 */}
        {order.status === 'cancelled' ? <Text style={styles.result}>직원이 취소한 주문이에요</Text> : null}
        {order.status === 'rejected' && order.rejectReason ? (
          <Text style={styles.result}>거절 사유: {REJECT_REASON_LABEL[order.rejectReason]}</Text>
        ) : null}
      </ScrollView>

      {actions ? <BottomBar>{actions}</BottomBar> : null}

      {/* 거절 사유 바텀시트 */}
      <BottomSheet visible={rejectOpen} title="거절 사유를 선택해 주세요" onClose={() => setRejectOpen(false)}>
        <View style={styles.reasons}>
          {REJECT_REASONS.map((reason) => {
            const selected = reason === rejectReason;
            return (
              <Pressable
                key={reason}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => setRejectReason(reason)}
                style={styles.reason}
              >
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={24}
                  color={selected ? colors.primary : colors.textSub}
                />
                <Text style={styles.ownerBody}>{REJECT_REASON_LABEL[reason]}</Text>
              </Pressable>
            );
          })}
        </View>
        <Button
          title="거절하기"
          size="large"
          disabled={!rejectReason}
          loading={pending === 'reject'}
          onPress={async () => {
            if (!rejectReason) return;
            const ok = await run(() => reject(rejectReason), '거절했어요');
            setRejectOpen(false);
            if (ok) router.back(); // 거절 후 오늘의 주문으로 (S-09는 화면 재진입 시 갱신)
          }}
        />
      </BottomSheet>

      {/* 노쇼 확인 모달 */}
      <ConfirmModal
        visible={noShowOpen}
        title="노쇼로 처리할까요?"
        description="도착 시간이 지나도 오지 않은 주문만 처리해 주세요."
        confirmLabel="노쇼 처리"
        danger
        loading={pending === 'no_show'}
        onCancel={() => setNoShowOpen(false)}
        onConfirm={async () => {
          await run(() => changeStatus('no_show'), '노쇼로 처리했어요');
          setNoShowOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingVertical: space.sm,
    gap: space.sm,
  },
  section: {
    backgroundColor: colors.surface,
    padding: layout.screenPadding,
    gap: space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  arrival: {
    ...typography.ownerArrival,
    color: colors.text,
  },
  people: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  label: {
    ...typography.sub,
    color: colors.textSub,
  },
  ownerBody: {
    ...typography.ownerBody,
    color: colors.text,
  },
  ownerBodyStrong: {
    ...typography.ownerBodyStrong,
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  result: {
    ...typography.ownerBodyStrong,
    color: colors.textSub,
    textAlign: 'center',
    padding: layout.screenPadding,
  },
  actionRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  rejectButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 2,
  },
  noShow: {
    alignSelf: 'center',
  },
  reasons: {
    marginBottom: space.lg,
  },
  reason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: layout.listItemHeight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
