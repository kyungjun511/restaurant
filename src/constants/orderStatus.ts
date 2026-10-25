// dev-spec.md 6.3 주문 상태 변경 규칙, service-plan.md 5장 상태 이름
import type {
  OrderListScope,
  OrderStatus,
  OwnerOrderTab,
  RejectReason,
} from '@/src/types/models';
import { badgeColors } from './colors';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  requested: '주문 요청',
  accepted: '주문 수락',
  rejected: '주문 거절',
  cancelled: '주문 취소',
  preparing: '준비 중',
  ready: '준비 완료',
  served: '제공 완료',
  no_show: '노쇼',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, { background: string; text: string }> = {
  requested: badgeColors.requested,
  accepted: badgeColors.accepted,
  rejected: badgeColors.rejected,
  cancelled: badgeColors.cancelled,
  preparing: badgeColors.preparing,
  ready: badgeColors.ready,
  served: badgeColors.served,
  no_show: badgeColors.no_show,
};

export const REJECT_REASON_LABEL: Record<RejectReason, string> = {
  sold_out: '품절',
  full: '만석',
  time_unavailable: '시간 불가',
  other: '기타',
};

export const REJECT_REASONS: RejectReason[] = ['sold_out', 'full', 'time_unavailable', 'other'];

// 현재 상태 → 바꿀 수 있는 상태 (노쇼는 "준비 완료" 이후에만)
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  requested: ['accepted', 'rejected', 'cancelled'],
  accepted: ['preparing'],
  preparing: ['ready'],
  ready: ['served', 'no_show'],
  rejected: [],
  cancelled: [],
  served: [],
  no_show: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}

// 상태 묶음
export const EMPLOYEE_SCOPE_STATUSES: Record<OrderListScope, OrderStatus[]> = {
  active: ['requested', 'accepted', 'preparing', 'ready'],
  past: ['served', 'rejected', 'cancelled', 'no_show'],
};

export const OWNER_TAB_STATUSES: Record<OwnerOrderTab, OrderStatus[]> = {
  new: ['requested'],
  active: ['accepted', 'preparing', 'ready'],
  done: ['served', 'rejected', 'cancelled', 'no_show'],
};
