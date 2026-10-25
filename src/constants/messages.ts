// 반복해서 쓰는 화면 문구 (design-spec.md 5장, dev-spec.md 7.1)
import type { ApiErrorCode } from '@/src/types/api';

// 서버가 message를 주지 않을 때 쓰는 기본 문구
export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  VALIDATION_ERROR: '입력 내용을 확인해 주세요',
  UNAUTHORIZED: '다시 로그인해 주세요',
  INVALID_CREDENTIALS: '사번 또는 비밀번호가 맞지 않아요',
  FORBIDDEN: '접근 권한이 없어요',
  ACCOUNT_DISABLED: '사용이 중지된 계정이에요. 회사 담당자에게 문의해 주세요',
  NOT_FOUND: '찾을 수 없어요',
  DUPLICATE: '이미 등록된 값이에요',
  INVALID_STATUS_TRANSITION: '이미 처리된 주문이에요',
  ORDER_CLOSED: '오늘 주문이 마감됐어요',
  RESTAURANT_NOT_ACCEPTING: '오늘은 주문을 받지 않는 음식점이에요',
  MENU_SOLD_OUT: '품절된 메뉴가 있어요',
  SERVER_ERROR: '잠시 후 다시 시도해 주세요',
  NETWORK_ERROR: '연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요',
};

export const COMMON_MESSAGES = {
  retry: '다시 시도',
  cancel: '취소',
  close: '닫기',
  paymentOnSite: '결제는 매장에서 현장 결제해요',
  pullToRefresh: '아래로 당겨 새로고침',
  unknownError: '잠시 후 다시 시도해 주세요',
} as const;

// 오류 객체에서 화면에 보여줄 문구 꺼내기
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return COMMON_MESSAGES.unknownError;
}
