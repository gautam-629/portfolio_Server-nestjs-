import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums/roles.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: [RoleEnum, ...RoleEnum[]]) =>
  SetMetadata(ROLES_KEY, roles);
