import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { ROLES } from '../../../common/constants/roles.contants';


@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLES[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}