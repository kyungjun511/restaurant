// dev-spec.md 5.2 ② HTTP 클라이언트: 서버 주소 붙이기, 토큰 헤더, 오류 변환 (http/ 파일만 사용)
import { env } from '@/src/config/env';
import { ERROR_MESSAGES } from '@/src/constants/messages';
import { ApiError, type ApiResponse } from '@/src/types/api';
import { tokenStorage } from '@/src/utils/secureStorage';

export async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await tokenStorage.get();
  let res: Response;
  try {
    res = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('NETWORK_ERROR', ERROR_MESSAGES.NETWORK_ERROR, 0);
  }

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('SERVER_ERROR', ERROR_MESSAGES.SERVER_ERROR, res.status);
  }
  if (!json.success) {
    const { code, message } = json.error;
    throw new ApiError(code, message || ERROR_MESSAGES.SERVER_ERROR, res.status);
  }
  return json.data;
}
