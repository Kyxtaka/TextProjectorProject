import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtRevokedService } from '../service/jwt-revoked.service';
import { JWT_TYPE } from '../../../common/constants/jwt-type.constant';
import { JwtAuthService } from '../service/jwt-auth.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly jwtRevokedService: JwtRevokedService,
    private readonly jwtService: JwtAuthService
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    if (await this.jwtRevokedService.isRevokedByJti(payload.jti)) {
      throw new UnauthorizedException('Token has been revoked');
    }else if (payload.jwt_type !== JWT_TYPE.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }else if (!await this.jwtService.findJwtIssuedByJti(payload.jti)) {
      throw new UnauthorizedException('unavailable token');
    }
    return { ...payload, id: payload.sub };
  }
}