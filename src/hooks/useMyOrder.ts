// S-06 주문 완료 화면의 주문 단건 (API-12)
import { api } from '@/src/api';
import { useAsync } from './useAsync';

export function useMyOrder(orderId: string) {
  return useAsync(() => api.orders.getMyOrder(orderId), [orderId]);
}
