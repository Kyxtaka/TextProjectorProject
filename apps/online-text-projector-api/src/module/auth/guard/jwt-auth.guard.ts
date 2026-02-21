import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANONYMOUS } from '../../../common/decorators/allow-anonymous.decorator';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        const allowAnonymous = this.reflector.getAllAndOverride<boolean>(ALLOW_ANONYMOUS, [
            context.getHandler(),
            context.getClass(),
        ]);
        // for example, call super.logIn(request) to establish a session.
        if (allowAnonymous) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
        throw err || new UnauthorizedException();
        }
        return user;
    }
}
