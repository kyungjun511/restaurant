// mock에서 "서버가 토큰으로 사용자 확인"하는 부분을 흉내 냄
// 토큰 모양: 'mock-token-<사용자ID>'
import { ERROR_MESSAGES } from '@/src/constants/messages';
import { db } from '@/src/mocks/db';
import type { MockUser } from '@/src/mocks/data/users';
import { ApiError } from '@/src/types/api';
import type { User, UserRole } from '@/src/types/models';
import { tokenStorage } from '@/src/utils/secureStorage';

const TOKEN_PREFIX = 'mock-token-';

export const makeToken = (userId: string) => `${TOKEN_PREFIX}${userId}`;

// 비밀번호 등 mock 전용 필드를 빼고 화면에 줄 User만 남김
export function toPublicUser(user: MockUser): User {
  const { password: _password, mustChangePassword: _mustChange, ...rest } = user;
  return rest;
}

// 로그인한 사용자 확인 + (주면) 사용자 유형 검사
export async function requireUser(role?: UserRole): Promise<MockUser> {
  const token = await tokenStorage.get();
  const userId = token?.startsWith(TOKEN_PREFIX) ? token.slice(TOKEN_PREFIX.length) : null;
  const user = userId ? db.findUserById(userId) : undefined;
  if (!user) throw new ApiError('UNAUTHORIZED', ERROR_MESSAGES.UNAUTHORIZED, 401);
  if (user.status === 'disabled') {
    throw new ApiError('ACCOUNT_DISABLED', ERROR_MESSAGES.ACCOUNT_DISABLED, 403);
  }
  if (role && user.role !== role) throw new ApiError('FORBIDDEN', ERROR_MESSAGES.FORBIDDEN, 403);
  return user;
}
