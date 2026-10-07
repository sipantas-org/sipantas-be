import type { AdminRole } from '../../generated/prisma/enums.js';

export interface JwtPayload {
  sub: number;
  email: string;
  userType: 'admin' | 'surveyor';
  role?: AdminRole;
}
