// 주문 표시 문구 도우미
import type { Order } from '@/src/types/models';

// '김치찌개 2, 된장찌개 1'
export function summarizeItems(order: Pick<Order, 'items'>): string {
  return order.items.map((i) => `${i.menuName} ${i.quantity}`).join(', ');
}

// 'A회사 김대리'
export function ordererName(order: Pick<Order, 'employee'>): string {
  return `${order.employee.companyName} ${order.employee.name}`;
}
