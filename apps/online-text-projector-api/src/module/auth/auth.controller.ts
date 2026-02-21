import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
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
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const userModel = await this.userService.findUserByEmail(req.user.email);
        return this.userService.modelToDto(userModel);
    }
}
