import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserModel } from '../users/user.model';
import { JwtAuthService } from '../jwt/service/jwt-auth.service';
import { JwtRevokedService } from '../jwt/service/jwt-revoked.service';
import { JWT_TYPE } from '../../common/constants/jwt-type.constant';
import { Payload } from '../jwt/payload.object';
import { JwtIssuedEntity } from '../jwt/entity/jwt-issued.entity';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ROLES } from '../../common/constants/roles.constant';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtAuthService,
    private jwtRevokedService: JwtRevokedService,
    private userService: UserService,
    private readonly configService: ConfigService
  ) {}

  async validateUserCredentials(email: string, password: string): Promise<UserModel | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }


  createJwtPayload(user: UserModel): Payload {
    const payload: Payload = {
      email: user.email,
      sub: user.id,
      role: user.permission,
      jti: crypto.randomUUID(), // Générer un jti unique basé sur l'utilisateur
      jwt_type: JWT_TYPE.ACCESS,
    };
    console.log('Creating JWT payload:', payload);
    return payload;
  }

  async login(user: UserModel, payload: Payload) {
    console.log('Generating JWT for user object:', user);
    console.log('JWT Issued Entity:', payload);
    this.insertJwtIssued(payload.jti, user.id, payload.jwt_type);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async revokeTokenByJti(jti: string, currentUser: UserModel): Promise<void> {
    const issuedJwt = await this.jwtService.findJwtIssuedByJti(jti);
    if (!issuedJwt) {
      throw new UnauthorizedException('No token found with the provided JTI');
    }
    if (issuedJwt.userId !== currentUser.id && currentUser.permission !== ROLES.ADMIN) {
      throw new UnauthorizedException('You are not authorized to revoke this token');
    }
    await this.jwtRevokedService.revokeTokenByJti(jti);
    await this.jwtRevokedService.deleteExpiredTokens();
  }

  async insertJwtIssued(jti: string, userId: number, type: JWT_TYPE, customExpiresIn?: number): Promise<JwtIssuedEntity> {
    const issuedAt = new Date();
    let expiresIn: number = 0;
    if (type === JWT_TYPE.ACCESS) {
      expiresIn = this.configService.get<number>('JWT_ACCESS_EXPIRES_IN') || 86400; // Default to 1 day
    }else if (type === JWT_TYPE.REFRESH) {
      expiresIn = this.configService.get<number>('JWT_REFRESH_EXPIRES_IN') || 604800; // Default to 7 days
    }
    const expiresAt = new Date(issuedAt.getTime() + expiresIn * 1000);
    return await this.jwtService.insertJwtIssued(jti, userId, issuedAt, expiresAt, type);
  }
}