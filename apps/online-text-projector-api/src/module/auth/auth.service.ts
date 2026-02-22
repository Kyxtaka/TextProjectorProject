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
}