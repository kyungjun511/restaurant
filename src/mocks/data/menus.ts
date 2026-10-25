// mock 메뉴 (음식점마다 5개, 일부는 품절 확인용)
import type { Menu } from '@/src/types/models';

export const seedMenus: Menu[] = [
  // r1 건물 앞 백반집
  { id: 'm1', restaurantId: 'r1', name: '김치찌개', price: 9000, description: '돼지고기 듬뿍', isSoldOut: false },
  { id: 'm2', restaurantId: 'r1', name: '된장찌개', price: 8000, description: '두부와 애호박', isSoldOut: false },
  { id: 'm3', restaurantId: 'r1', name: '제육볶음', price: 10000, description: '매콤한 불맛', isSoldOut: true },
  { id: 'm4', restaurantId: 'r1', name: '순두부찌개', price: 9000, description: '해물 순두부', isSoldOut: false },
  { id: 'm5', restaurantId: 'r1', name: '계란말이', price: 6000, description: '반찬으로 좋아요', isSoldOut: false },

  // r2 국수나무
  { id: 'm6', restaurantId: 'r2', name: '잔치국수', price: 6000, description: '멸치 육수', isSoldOut: false },
  { id: 'm7', restaurantId: 'r2', name: '비빔국수', price: 7000, description: '새콤달콤', isSoldOut: false },
  { id: 'm8', restaurantId: 'r2', name: '칼국수', price: 8000, description: '바지락 칼국수', isSoldOut: false },
  { id: 'm9', restaurantId: 'r2', name: '김밥', price: 4000, isSoldOut: false },
  { id: 'm10', restaurantId: 'r2', name: '고기만두', price: 5000, description: '6개', isSoldOut: true },

  // r3 그린 샐러드
  { id: 'm11', restaurantId: 'r3', name: '닭가슴살 샐러드', price: 9500, description: '수제 드레싱', isSoldOut: false },
  { id: 'm12', restaurantId: 'r3', name: '연어 샐러드', price: 12000, isSoldOut: false },
  { id: 'm13', restaurantId: 'r3', name: '치킨 랩', price: 8500, description: '또띠아 랩', isSoldOut: false },
  { id: 'm14', restaurantId: 'r3', name: '불고기 랩', price: 9000, isSoldOut: false },
  { id: 'm15', restaurantId: 'r3', name: '오늘의 수프', price: 4500, isSoldOut: true },
];
