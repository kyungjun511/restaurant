// API-10 ~ API-12 실제 서버 호출
import { request } from '../client';
import type { OrdersApi } from '../contracts';

export const httpOrdersApi: OrdersApi = {
  createOrder: (input) => request('POST', '/orders', input),
  getMyOrders: (scope) => request('GET', `/me/orders?scope=${scope}`),
  getMyOrder: (orderId) => request('GET', `/me/orders/${orderId}`),
};
