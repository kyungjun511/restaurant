// mock 입주 회사 3개 (가짜 데이터)
import type { Company } from '@/src/types/models';

export const seedCompanies: Company[] = [
  { id: 'c1', name: 'A회사', location: '5층 501호', isActive: true },
  { id: 'c2', name: 'B회사', location: '7층 701호', isActive: true },
  { id: 'c3', name: 'C회사', location: '9층 902호', isActive: true },
];
