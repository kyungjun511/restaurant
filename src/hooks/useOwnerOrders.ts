// S-09 오늘의 주문 (API-15): 탭별 주문 + 탭 개수
import { api } from '@/src/api';
import type { OwnerOrderTab } from '@/src/types/models';
import { useAsync } from './useAsync';

export function useOwnerOrders(tab: OwnerOrderTab) {
  return useAsync(() => api.owner.getOrders({ tab }), [tab]);
}
