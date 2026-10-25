// API-15 ~ API-19, API-26 실제 서버 호출
import { request } from '../client';
import type { OwnerApi } from '../contracts';

export const httpOwnerApi: OwnerApi = {
  getOrders: ({ date, tab }) =>
    request('GET', `/owner/orders?${date ? `date=${date}&` : ''}tab=${tab}`),
  getOrder: (orderId) => request('GET', `/owner/orders/${orderId}`),
  acceptOrder: (orderId) => request('POST', `/owner/orders/${orderId}/accept`),
  rejectOrder: (orderId, reason) => request('POST', `/owner/orders/${orderId}/reject`, { reason }),
  updateOrderStatus: (orderId, status) =>
    request('PATCH', `/owner/orders/${orderId}/status`, { status }),
  getMyRestaurant: () => request('GET', '/owner/restaurant'),
};
