import { Controller, Get, Post, Request, UseGuards, Param, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { AllowAnonymous } from '../../common/decorators/allow-anonymous.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @AllowAnonymous()
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        const payload = this.authService.createJwtPayload(req.user);
        console.log('Generated JWT Payload:', payload);
        return this.authService.login(req.user, payload);
    }

    @Get('profile')
    async getProfile(@Request() req) {
        const userModel = await this.userService.findUserByEmail(req.user.email);
        return this.userService.modelToDto(userModel);
    }

    @Get('jwtPayload')
    async getJwtPayload(@Request() req) {
        return req.user;
    }

    @Get('token/revoke/:jti')
    async revokeToken(@Request() req, @Param('jti') jti: string) {      
        if (!jti) {
            throw new BadRequestException('JTI is required');
        }
        const currentUser = await this.userService.findUserByEmail(req.user.email);
        await this.authService.revokeTokenByJti(jti, currentUser);
    }
}
