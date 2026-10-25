// S-01 회사 선택 목록 (API-01)
import { api } from '@/src/api';
import { useAsync } from './useAsync';

export function useCompanies() {
  return useAsync(() => api.auth.getCompanies(), []);
}
