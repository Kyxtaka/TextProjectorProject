import { Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService { 
    constructor(private readonly jwtService: JwtService) {}

    sign(payload: any): string {
        return this.jwtService.sign(payload);
    }

    getDeviceInfosTokenFromUserId(userId: number): string {
        const payload = { sub: userId };
        return this.jwtService.sign(payload);
    }
}   