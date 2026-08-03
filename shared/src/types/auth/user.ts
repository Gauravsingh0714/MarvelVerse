import { UUID } from '../common/primitives.js';
import { UserRole, Permission } from '../../enums/index.js';

export interface UserSummary {
  id: UUID;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}
