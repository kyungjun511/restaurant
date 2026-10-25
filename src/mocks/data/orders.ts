// mock 오늘 주문 4건. 날짜는 앱을 켠 날(today)로 만듦
import type { DateString, Order } from '@/src/types/models';

export function createSeedOrders(today: DateString): Order[] {
  const at = (time: string) => `${today}T${time}:00+09:00`;
  return [
    {
      id: 'o120', orderNo: '#0120', orderDate: today, arrivalTime: '12:00', partySize: 3, status: 'requested',
      requestNote: '덜 맵게 해주세요',
      items: [
        { menuId: 'm1', menuName: '김치찌개', quantity: 2, unitPrice: 9000 },
        { menuId: 'm2', menuName: '된장찌개', quantity: 1, unitPrice: 8000 },
      ],
      totalPrice: 26000,
      employee: { id: 'u2', name: '이과장', companyName: 'A회사' },
      restaurant: { id: 'r1', name: '건물 앞 백반집' },
      createdAt: at('10:41'),
    },
    {
      id: 'o121', orderNo: '#0121', orderDate: today, arrivalTime: '12:10', partySize: 1, status: 'requested',
      items: [{ menuId: 'm4', menuName: '순두부찌개', quantity: 1, unitPrice: 9000 }],
      totalPrice: 9000,
      employee: { id: 'u4', name: '최사원', companyName: 'B회사' },
      restaurant: { id: 'r1', name: '건물 앞 백반집' },
      createdAt: at('10:48'),
    },
    {
      id: 'o122', orderNo: '#0122', orderDate: today, arrivalTime: '11:50', partySize: 2, status: 'accepted',
      items: [{ menuId: 'm1', menuName: '김치찌개', quantity: 2, unitPrice: 9000 }],
      totalPrice: 18000,
      employee: { id: 'u5', name: '정대리', companyName: 'B회사' },
      restaurant: { id: 'r1', name: '건물 앞 백반집' },
      createdAt: at('10:30'),
    },
    {
      id: 'o123', orderNo: '#0123', orderDate: today, arrivalTime: '12:20', partySize: 1, status: 'ready',
      items: [{ menuId: 'm11', menuName: '닭가슴살 샐러드', quantity: 1, unitPrice: 9500 }],
      totalPrice: 9500,
      employee: { id: 'u1', name: '김대리', companyName: 'A회사' },
      restaurant: { id: 'r3', name: '그린 샐러드' },
      createdAt: at('10:15'),
    },
  ];
}
