// dev-spec.md 6.1 도메인 타입 (DB 스키마가 아니라 서버 응답과 맞출 앱 쪽 타입 초안)

// ── 공통 ─────────────────────────────
export type Id = string;
export type DateString = string;     // 'YYYY-MM-DD'      예: '2026-10-26'
export type TimeString = string;     // 'HH:mm' (24시간)  예: '12:10'
export type DateTimeString = string; // ISO 8601 + 한국 시간대  예: '2026-10-26T11:02:00+09:00'

// ── 회사 ─────────────────────────────
export interface Company {
  id: Id;
  name: string;          // 회사명
  location: string;      // 층/호수
  isActive: boolean;     // 사용 여부
}

// ── 사용자 ───────────────────────────
export type UserRole = 'employee' | 'owner' | 'company_admin' | 'super_admin';
export type AccountStatus = 'pending' | 'active' | 'disabled'; // 대기 / 승인(사용 중) / 비활성

export interface User {
  id: Id;
  role: UserRole;
  name: string;
  status: AccountStatus;
  companyId?: Id;        // 직원·회사 관리자
  companyName?: string;
  employeeNo?: string;   // 직원 사번 (회사 + 사번으로 구분)
  department?: string;
  loginId?: string;      // 사장님·관리자 아이디
  restaurantId?: Id;     // 사장님 소속 음식점
}

// ── 음식점 ───────────────────────────
export interface Restaurant {
  id: Id;
  name: string;
  location: string;
  phone: string;
  openTime: TimeString;
  closeTime: TimeString;
  orderDeadline: TimeString;   // 주문 마감 시간
  imageUrl?: string;           // 대표 사진
  isAcceptingOrders: boolean;  // 오늘 주문 받기 (F-21)
  isActive: boolean;           // 총괄 관리자 비활성화 (F-26)
}

// ── 메뉴 ─────────────────────────────
export interface Menu {
  id: Id;
  restaurantId: Id;
  name: string;
  price: number;         // 원, 정수
  imageUrl?: string;
  description?: string;
  isSoldOut: boolean;    // F-20
}

// ── 주문 ─────────────────────────────
export type OrderStatus =
  | 'requested'   // 주문 요청
  | 'accepted'    // 주문 수락
  | 'rejected'    // 주문 거절
  | 'cancelled'   // 주문 취소
  | 'preparing'   // 준비 중
  | 'ready'       // 준비 완료
  | 'served'      // 제공 완료
  | 'no_show';    // 노쇼

export type RejectReason = 'sold_out' | 'full' | 'time_unavailable' | 'other'; // 품절/만석/시간 불가/기타

// API-19로 바꿀 수 있는 상태 (수락·거절은 API-17, API-18)
export type OwnerNextStatus = 'preparing' | 'ready' | 'served' | 'no_show';

export interface OrderItem {
  menuId: Id;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: Id;
  orderNo: string;               // 화면 표시용 '#0123'
  orderDate: DateString;
  arrivalTime: TimeString;       // 도착 예정 시간
  partySize: number;             // 식사 인원
  status: OrderStatus;
  rejectReason?: RejectReason;
  requestNote?: string;          // 요청사항 (F-07)
  items: OrderItem[];
  totalPrice: number;            // 참고용, 결제는 현장
  employee: { id: Id; name: string; companyName: string };
  restaurant: { id: Id; name: string };
  createdAt: DateTimeString;
}

export type OrderListScope = 'active' | 'past';        // 직원 내 주문 탭
export type OwnerOrderTab = 'new' | 'active' | 'done'; // 사장님 오늘의 주문 탭

// ── 입력값 ───────────────────────────
export interface EmployeeLoginInput {
  companyId: Id;
  employeeNo: string;
  password: string;
}

export interface IdLoginInput {
  loginId: string;
  password: string;
}

export interface CreateOrderInput {
  restaurantId: Id;
  arrivalTime: TimeString;
  partySize: number;
  requestNote?: string;
  items: { menuId: Id; quantity: number }[];
}

export interface OwnerOrdersQuery {
  date?: DateString; // 생략 시 오늘
  tab: OwnerOrderTab;
}

// ── 응답 ─────────────────────────────
export interface LoginResult {
  token: string;
  mustChangePassword: boolean;
  user: User;
}

// API-15 사장님 오늘 주문 목록
export interface OwnerOrderList {
  counts: Record<OwnerOrderTab, number>; // 상단 탭 개수 배지용
  orders: Order[];                       // 도착 시간 빠른 순
}

// ── 장바구니 (기기 안에서만) ───────────
export interface CartItem {
  menuId: Id;
  name: string;
  price: number;
  quantity: number;
}
export interface Cart {
  restaurantId: Id | null;
  restaurantName: string | null;
  items: CartItem[];
}

// ── 시간대별 요약 (F-18) ───────────────
export interface TimeSlotSummary {
  slotStart: TimeString;   // '12:00'
  slotEnd: TimeString;     // '12:10'
  totalPartySize: number;
  menus: { menuId: Id; menuName: string; quantity: number }[];
}

// ── 주문 현황 (F-27) ──────────────────
export interface AdminOrderStats {
  total: number;
  served: number;
  rejected: number;
  noShow: number;
}

// ── 가입 신청 (F-28, 2차) ─────────────
export interface SignupRequest {
  id: Id;
  companyId: Id;
  employeeNo: string;
  name: string;
  department: string;
  requestedAt: DateTimeString;
}
