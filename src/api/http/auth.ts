// API-01 ~ API-05 실제 서버 호출 (서버 연결 시 사용)
import { request } from '../client';
import type { AuthApi } from '../contracts';

export const httpAuthApi: AuthApi = {
  getCompanies: () => request('GET', '/companies'),
  loginEmployee: (input) => request('POST', '/auth/employee-login', input),
  login: (input) => request('POST', '/auth/login', input),
  logout: () => request('POST', '/auth/logout'),
  getMe: () => request('GET', '/me'),
};
