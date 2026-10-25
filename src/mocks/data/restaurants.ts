// mock 음식점 3개. 국수나무는 "오늘 주문 마감" 표시 확인용으로 주문을 받지 않음
import type { Restaurant } from '@/src/types/models';

export const seedRestaurants: Restaurant[] = [
  { id: 'r1', name: '건물 앞 백반집', location: '건물 1층', phone: '02-123-4567', openTime: '11:00', closeTime: '21:00', orderDeadline: '11:30', isAcceptingOrders: true, isActive: true },
  { id: 'r2', name: '국수나무', location: '건물 B1', phone: '02-234-5678', openTime: '11:00', closeTime: '15:00', orderDeadline: '11:30', isAcceptingOrders: false, isActive: true },
  { id: 'r3', name: '그린 샐러드', location: '건물 2층', phone: '02-345-6789', openTime: '10:30', closeTime: '20:00', orderDeadline: '11:40', isAcceptingOrders: true, isActive: true },
];
