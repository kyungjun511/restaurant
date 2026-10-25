// mock 계정 (dev-spec.md 5.3). 비밀번호는 모두 테스트용 가짜 값입니다.
import type { User } from '@/src/types/models';

export interface MockUser extends User {
  password: string;
  mustChangePassword: boolean;
}

const TEST_PASSWORD = 'test1234';

export const seedUsers: MockUser[] = [
  // 직원 6명 — A회사 1001과 B회사 1001은 다른 사람
  { id: 'u1', role: 'employee', name: '김대리', status: 'active', companyId: 'c1', companyName: 'A회사', employeeNo: '1001', department: '재무팀', password: TEST_PASSWORD, mustChangePassword: false },
  { id: 'u2', role: 'employee', name: '이과장', status: 'active', companyId: 'c1', companyName: 'A회사', employeeNo: '1002', department: '영업팀', password: TEST_PASSWORD, mustChangePassword: false },
  { id: 'u3', role: 'employee', name: '박주임', status: 'disabled', companyId: 'c1', companyName: 'A회사', employeeNo: '0987', department: '총무팀', password: TEST_PASSWORD, mustChangePassword: false },
  { id: 'u4', role: 'employee', name: '최사원', status: 'active', companyId: 'c2', companyName: 'B회사', employeeNo: '1001', department: '개발팀', password: TEST_PASSWORD, mustChangePassword: false },
  { id: 'u5', role: 'employee', name: '정대리', status: 'active', companyId: 'c2', companyName: 'B회사', employeeNo: '1002', department: '기획팀', password: TEST_PASSWORD, mustChangePassword: false },
  { id: 'u6', role: 'employee', name: '한과장', status: 'active', companyId: 'c3', companyName: 'C회사', employeeNo: '1001', department: '인사팀', password: TEST_PASSWORD, mustChangePassword: false },

  // 사장님 3명
  { id: 'o1', role: 'owner', name: '박사장', status: 'active', loginId: 'owner1', restaurantId: 'r1', password: TEST_PASSWORD, mustChangePassword: false },
  { id: 'o2', role: 'owner', name: '윤사장', status: 'active', loginId: 'owner2', restaurantId: 'r2', password: TEST_PASSWORD, mustChangePassword: false },
  { id: 'o3', role: 'owner', name: '서사장', status: 'active', loginId: 'owner3', restaurantId: 'r3', password: TEST_PASSWORD, mustChangePassword: false },

  // 회사 관리자 3명
  { id: 'a1', role: 'company_admin', name: 'A회사 담당자', status: 'active', loginId: 'admin-a', companyId: 'c1', companyName: 'A회사', password: TEST_PASSWORD, mustChangePassword: false },
  { id: 'a2', role: 'company_admin', name: 'B회사 담당자', status: 'active', loginId: 'admin-b', companyId: 'c2', companyName: 'B회사', password: TEST_PASSWORD, mustChangePassword: false },
  { id: 'a3', role: 'company_admin', name: 'C회사 담당자', status: 'active', loginId: 'admin-c', companyId: 'c3', companyName: 'C회사', password: TEST_PASSWORD, mustChangePassword: false },

  // 총괄 관리자 1명
  { id: 's1', role: 'super_admin', name: '총괄 관리자', status: 'active', loginId: 'superadmin', password: TEST_PASSWORD, mustChangePassword: false },
];
