// design-spec.md 3.4 주문 카드 (사장님): 도착 시간(큰 글자) + 인원 + 메뉴 요약 + 회사·이름 + 상태 배지
// 신규(주문 요청) 주문은 주황 테두리로 강조 (F-14 대체안)
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/common/Card';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { colors } from '@/src/constants/colors';
import { space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import type { Order } from '@/src/types/models';
import { ordererName, summarizeItems } from '@/src/utils/orderText';

interface OwnerOrderCardProps {
  order: Order;
  onPress: () => void;
}

export function OwnerOrderCard({ order, onPress }: OwnerOrderCardProps) {
  return (
    <Card onPress={onPress} highlighted={order.status === 'requested'}>
      <View style={styles.top}>
        <Text style={styles.arrival}>{order.arrivalTime}</Text>
        <StatusBadge status={order.status} />
      </View>
      <View style={styles.people}>
        <Ionicons name="people-outline" size={18} color={colors.text} />
        <Text style={styles.body}>{order.partySize}명</Text>
      </View>
      <Text style={styles.body} numberOfLines={2}>
        {summarizeItems(order)}
      </Text>
      <Text style={styles.orderer}>{ordererName(order)}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrival: {
    ...typography.ownerArrival,
    color: colors.text,
  },
  people: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginTop: space.xs,
  },
  body: {
    ...typography.ownerBody,
    color: colors.text,
  },
  orderer: {
    ...typography.sub,
    color: colors.textSub,
    marginTop: space.xs,
  },
});
