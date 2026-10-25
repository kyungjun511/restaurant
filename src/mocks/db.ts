// mock 저장소: 앱 실행 중 메모리에만 데이터를 들고 있음 (앱을 완전히 다시 켜면 초기화)
// 밖으로 내보내는 값은 항상 복사본이라, 화면에서 바꿔도 저장소가 몰래 바뀌지 않음
import type { Company, Id, Menu, Order, Restaurant } from '@/src/types/models';
import { now } from '@/src/utils/clock';
import { toDateString } from '@/src/utils/format';
import { seedCompanies } from './data/companies';
import { seedMenus } from './data/menus';
import { createSeedOrders } from './data/orders';
import { seedRestaurants } from './data/restaurants';
import { seedUsers, type MockUser } from './data/users';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const state = {
  companies: clone(seedCompanies),
  users: clone(seedUsers),
  restaurants: clone(seedRestaurants),
  menus: clone(seedMenus),
  orders: createSeedOrders(toDateString(now())),
  nextOrderSeq: 124, // 다음 주문 번호 #0124
};

export const db = {
  // 회사
  listCompanies(): Company[] {
    return clone(state.companies);
  },

  // 사용자 (비밀번호가 들어 있으므로 mock api 안에서만 사용)
  findUserById(id: Id): MockUser | undefined {
    const user = state.users.find((u) => u.id === id);
    return user && clone(user);
  },
  findEmployee(companyId: Id, employeeNo: string): MockUser | undefined {
    const user = state.users.find(
      (u) => u.role === 'employee' && u.companyId === companyId && u.employeeNo === employeeNo,
    );
    return user && clone(user);
  },
  findUserByLoginId(loginId: string): MockUser | undefined {
    const user = state.users.find((u) => u.role !== 'employee' && u.loginId === loginId);
    return user && clone(user);
  },

  // 음식점
  listRestaurants(): Restaurant[] {
    return clone(state.restaurants);
  },
  findRestaurant(id: Id): Restaurant | undefined {
    const restaurant = state.restaurants.find((r) => r.id === id);
    return restaurant && clone(restaurant);
  },

  // 메뉴
  listMenus(restaurantId: Id): Menu[] {
    return clone(state.menus.filter((m) => m.restaurantId === restaurantId));
  },
  findMenu(id: Id): Menu | undefined {
    const menu = state.menus.find((m) => m.id === id);
    return menu && clone(menu);
  },

  // 주문
  listOrders(filter: (order: Order) => boolean = () => true): Order[] {
    return clone(state.orders.filter(filter));
  },
  findOrder(id: Id): Order | undefined {
    const order = state.orders.find((o) => o.id === id);
    return order && clone(order);
  },
  insertOrder(order: Omit<Order, 'id' | 'orderNo'>): Order {
    const seq = state.nextOrderSeq++;
    const created: Order = { ...clone(order), id: `o${seq}`, orderNo: `#${String(seq).padStart(4, '0')}` };
    state.orders.push(created);
    return clone(created);
  },
  updateOrder(id: Id, patch: Partial<Omit<Order, 'id'>>): Order {
    const index = state.orders.findIndex((o) => o.id === id);
    if (index < 0) throw new Error(`mock db: order ${id} not found`);
    state.orders[index] = { ...state.orders[index], ...clone(patch) };
    return clone(state.orders[index]);
  },
};
