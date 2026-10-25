// dev-spec.md 6.2 공통 응답·오류 타입
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

// dev-spec.md 7.1 오류 코드 표
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'INVALID_CREDENTIALS'
  | 'FORBIDDEN'
  | 'ACCOUNT_DISABLED'
  | 'NOT_FOUND'
  | 'DUPLICATE'
  | 'INVALID_STATUS_TRANSITION'
  | 'ORDER_CLOSED'
  | 'RESTAURANT_NOT_ACCEPTING'
  | 'MENU_SOLD_OUT'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR';

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode | string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
