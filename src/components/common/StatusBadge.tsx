// 주문 상태 배지: 색과 함께 반드시 글자로 표시 (design-spec.md 6장 "색만으로 구분 금지")
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABEL } from '@/src/constants/orderStatus';
import type { OrderStatus } from '@/src/types/models';
import { Badge } from './Badge';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { background, text } = ORDER_STATUS_COLORS[status];
  return <Badge label={ORDER_STATUS_LABEL[status]} backgroundColor={background} color={text} />;
}
