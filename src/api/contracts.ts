// dev-spec.md 5.2 ① API 함수 모양. mock과 http가 똑같이 따름
// 1단계: Must 기능에 필요한 API만 정의 (Should·Could API는 해당 단계에서 추가)
import type {
  Company,
  CreateOrderInput,
  EmployeeLoginInput,
  Id,
  IdLoginInput,
  LoginResult,
  Menu,
  Order,
  OrderListScope,
  OwnerNextStatus,
  OwnerOrderList,
  OwnerOrdersQuery,
  RejectReason,
  Restaurant,
  User,
} from '@/src/types/models';

export interface AuthApi {
  getCompanies(): Promise<Company[]>;                          // API-01
  loginEmployee(input: EmployeeLoginInput): Promise<LoginResult>; // API-02
  login(input: IdLoginInput): Promise<LoginResult>;            // API-03
  logout(): Promise<null>;                                     // API-04
  getMe(): Promise<User>;                                      // API-05
}

export interface RestaurantsApi {
  getRestaurants(): Promise<Restaurant[]>;                     // API-07
  getRestaurant(restaurantId: Id): Promise<Restaurant>;        // API-08
  getMenus(restaurantId: Id): Promise<Menu[]>;                 // API-09
}

export interface OrdersApi {
  createOrder(input: CreateOrderInput): Promise<Order>;        // API-10
  getMyOrders(scope: OrderListScope): Promise<Order[]>;        // API-11
  getMyOrder(orderId: Id): Promise<Order>;                     // API-12
}

export interface OwnerApi {
  getOrders(query: OwnerOrdersQuery): Promise<OwnerOrderList>; // API-15
  getOrder(orderId: Id): Promise<Order>;                       // API-16
  acceptOrder(orderId: Id): Promise<Order>;                    // API-17
  rejectOrder(orderId: Id, reason: RejectReason): Promise<Order>; // API-18
  updateOrderStatus(orderId: Id, status: OwnerNextStatus): Promise<Order>; // API-19
  getMyRestaurant(): Promise<Restaurant>;                      // API-26 (S-09 헤더 음식점명)
}

export interface Api {
  auth: AuthApi;
  restaurants: RestaurantsApi;
  orders: OrdersApi;
  owner: OwnerApi;
}
