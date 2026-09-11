import { Controller, Get, Post, Request, UseGuards, Param, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { AllowAnonymous } from '../../common/decorators/allow-anonymous.decorator';
import { AuthRole } from '../../common/decorators/auth-role.decorator';
import { ROLES } from '../../common/constants/roles.constant';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @AllowAnonymous()
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
            const payload = this.authService.createJwtPayload(req.user);
            const refreshPayload = this.authService.createRefreshJwtPayload(req.user);
            console.log('Generated Refresh JWT Payload:', refreshPayload);
            console.log('Generated JWT Payload:', payload);
            return this.authService.login(req.user, payload, refreshPayload);
       
        
    }

    @Get('profile')
    async getProfile(@Request() req) {
        const userModel = await this.userService.findUserByEmail(req.user.email);
        return this.userService.modelToDto(userModel);
    }

    @Get('token/payload')
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

    @AllowAnonymous()
    @Post('token/refresh')
    async refreshAccessToken(@Request() req) {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            throw new BadRequestException('Refresh token is required');
        }
        const decodedRefreshToken = this.authService.verifyRefreshToken(refresh_token);
        const user = await this.userService.findUserByUuid((await decodedRefreshToken).sub);
        const newPayload = this.authService.createJwtPayload(user);
        const newRefreshPayload = this.authService.createRefreshJwtPayload(user);
        const loginResponse = await this.authService.login(user, newPayload, newRefreshPayload);
        await this.authService.revokeTokenByJti((await decodedRefreshToken).jti, user); // Revoke all previous tokens for the user
        return loginResponse;   
    }

    @Get("devices/fresh-disconnect/:userUuid")
    @AuthRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)
    async disconnectUserDevices(@Request() req, @Param('userUuid') userUuid: string) {
        const currentUser = await this.userService.findUserByUuid(userUuid);
        if (!currentUser) {
            throw new BadRequestException('User not found');
        }
        await this.authService.revokeTokensByUserId(currentUser.id);
    }

    @Get("devices/self-fresh-disconnect")
    async selfDisconnectUserDevices(@Request() req) {
        const currentUser = await this.userService.findUserByUuid(req.user.sub);
        if (!currentUser) {
            throw new BadRequestException('User not found');
        }
        await this.authService.revokeTokensByUserId(currentUser.id);
    }
}
    