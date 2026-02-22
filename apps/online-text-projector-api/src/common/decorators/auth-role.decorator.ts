
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthRoleGuard } from '../../module/auth/guard/authRole.guard';
import { ROLES } from '../constants/roles.contants';
// import { RolesGuard } from '../../module/auth/guards/roles.guard';
export function AuthRole(...roles: ROLES[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthRoleGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}