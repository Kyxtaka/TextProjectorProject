import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../../users/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
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
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}