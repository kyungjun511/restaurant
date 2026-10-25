// 사용자 유형별 첫 화면 (design-spec.md S-01 "성공")
import type { UserRole } from '@/src/types/models';

export const ROLE_HOME = {
  employee: '/employee/home',         // S-03
  owner: '/owner/orders',             // S-09
  company_admin: '/company-admin/employees', // S-15
  super_admin: '/admin/companies',    // S-17
} as const satisfies Record<UserRole, string>;
