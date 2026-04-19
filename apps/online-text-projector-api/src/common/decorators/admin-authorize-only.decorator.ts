import { SetMetadata } from '@nestjs/common';
export const ADMIN_AUTHORIZE_ONLY = 'ADMIN_AUTHORIZE_ONLY';
export const AdminAuthorizeOnly = () => SetMetadata(ADMIN_AUTHORIZE_ONLY, true);