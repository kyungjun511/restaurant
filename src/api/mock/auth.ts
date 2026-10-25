// API-01 ~ API-05 mock 구현
import { ERROR_MESSAGES } from '@/src/constants/messages';
import { db } from '@/src/mocks/db';
import type { MockUser } from '@/src/mocks/data/users';
import { delay } from '@/src/mocks/delay';
import { ApiError } from '@/src/types/api';
import type { LoginResult } from '@/src/types/models';
import type { AuthApi } from '../contracts';
import { makeToken, requireUser, toPublicUser } from './session';

function toLoginResult(user: MockUser): LoginResult {
  if (user.status === 'disabled') {
    throw new ApiError('ACCOUNT_DISABLED', ERROR_MESSAGES.ACCOUNT_DISABLED, 403);
  }
  return {
    token: makeToken(user.id),
    mustChangePassword: user.mustChangePassword,
    user: toPublicUser(user),
  };
}

export const mockAuthApi: AuthApi = {
  async getCompanies() {
    await delay();
    return db.listCompanies().filter((c) => c.isActive);
  },

  async loginEmployee({ companyId, employeeNo, password }) {
    await delay();
    if (!companyId || !employeeNo.trim() || !password) {
      throw new ApiError('VALIDATION_ERROR', ERROR_MESSAGES.VALIDATION_ERROR, 400);
    }
    const user = db.findEmployee(companyId, employeeNo.trim());
    if (!user || user.password !== password) {
      throw new ApiError('INVALID_CREDENTIALS', '사번 또는 비밀번호가 맞지 않아요', 401);
    }
    return toLoginResult(user);
  },

  async login({ loginId, password }) {
    await delay();
    if (!loginId.trim() || !password) {
      throw new ApiError('VALIDATION_ERROR', ERROR_MESSAGES.VALIDATION_ERROR, 400);
    }
    const user = db.findUserByLoginId(loginId.trim());
    if (!user || user.password !== password) {
      throw new ApiError('INVALID_CREDENTIALS', '아이디 또는 비밀번호가 맞지 않아요', 401);
    }
    return toLoginResult(user);
  },

  async logout() {
    await delay();
    return null;
  },

  async getMe() {
    await delay();
    return toPublicUser(await requireUser());
  },
};
