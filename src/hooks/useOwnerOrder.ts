// S-10 주문 상세 (API-16) + 수락·거절·상태 변경 (API-17, 18, 19)
import { useCallback, useState } from 'react';

import { api } from '@/src/api';
import type { Order, OwnerNextStatus, RejectReason } from '@/src/types/models';
import { useAsync } from './useAsync';

// 지금 처리 중인 동작 (해당 버튼에만 로딩 표시)
export type OwnerOrderAction = 'accept' | 'reject' | OwnerNextStatus;

export function useOwnerOrder(orderId: string) {
  const detail = useAsync(() => api.owner.getOrder(orderId), [orderId]);
  const { setData } = detail;
  const [pending, setPending] = useState<OwnerOrderAction | null>(null);

  // 처리 API가 돌려준 주문으로 화면을 바로 갱신. 실패하면 오류를 그대로 던짐 (화면이 안내 띠 표시)
  const perform = useCallback(
    async (action: OwnerOrderAction, call: () => Promise<Order>) => {
      setPending(action);
      try {
        const updated = await call();
        setData(updated);
        return updated;
      } finally {
        setPending(null);
      }
    },
    [setData],
  );

  const accept = useCallback(() => perform('accept', () => api.owner.acceptOrder(orderId)), [perform, orderId]);
  const reject = useCallback(
    (reason: RejectReason) => perform('reject', () => api.owner.rejectOrder(orderId, reason)),
    [perform, orderId],
  );
  const changeStatus = useCallback(
    (status: OwnerNextStatus) => perform(status, () => api.owner.updateOrderStatus(orderId, status)),
    [perform, orderId],
  );

  return { ...detail, pending, accept, reject, changeStatus };
}
