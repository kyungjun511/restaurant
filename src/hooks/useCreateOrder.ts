// S-05 주문 요청 (API-10). 처리 중에는 다시 누를 수 없게 isSubmitting으로 막음
import { useCallback, useRef, useState } from 'react';

import { api } from '@/src/api';
import type { CreateOrderInput, Order } from '@/src/types/models';

export function useCreateOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlight = useRef(false); // 같은 순간 두 번 눌림 방지 (state 반영 전)

  const createOrder = useCallback(async (input: CreateOrderInput): Promise<Order | null> => {
    if (inFlight.current) return null;
    inFlight.current = true;
    setIsSubmitting(true);
    try {
      return await api.orders.createOrder(input);
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
  }, []);

  return { createOrder, isSubmitting };
}
