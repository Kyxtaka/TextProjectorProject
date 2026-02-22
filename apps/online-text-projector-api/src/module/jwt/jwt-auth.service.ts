import { Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService { 
    constructor(private readonly jwtService: JwtService) {}

    sign(payload: any): string {
        return this.jwtService.sign(payload);
    }
}