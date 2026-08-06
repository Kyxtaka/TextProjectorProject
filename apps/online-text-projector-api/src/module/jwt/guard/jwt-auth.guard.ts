import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANONYMOUS } from '../../../common/decorators/allow-anonymous.decorator';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const allowAnonymous = this.reflector.getAllAndOverride<boolean>(ALLOW_ANONYMOUS, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (allowAnonymous) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
