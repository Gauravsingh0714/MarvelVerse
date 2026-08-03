import { UUID } from '../common/primitives.js';
import { UserRole } from '../../enums/user-role.enum.js';

export interface JwtPayload {
  sub: UUID;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface RequestContext {
  userId?: UUID;
  role?: UserRole;
  requestId?: string;
}
