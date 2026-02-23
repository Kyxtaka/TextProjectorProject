import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../users/user.model';
import { JwtAuthService } from '../jwt/service/jwt-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtAuthService ,
    private userService: UserService,
    private readonlu 
  ) {}

  async validateUserCredentials(email: string, password: string): Promise<UserModel | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: UserModel) {
    const payload = { email: user.email, sub: user.id, role: user.permission };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async insertJwtIssued(jti: string, userId: number, expiresIn: number, type: string) {
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + expiresIn * 1000);
    await this.jwtService.insertJwtIssued(jti, userId, issuedAt, expiresAt, type);
  }
}