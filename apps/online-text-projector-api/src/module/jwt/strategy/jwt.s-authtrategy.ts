import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtRevokedService } from '../service/jwt-revoked.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly jwtRevokedService: JwtRevokedService, // à injecter
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
    // Vérifie si le token a été révoqué (par exemple via jti ou sub)
    if (await this.jwtRevokedService.isRevoked(payload.jti || payload.sub)) {
      throw new UnauthorizedException('Token has been revoked');
    }
    return { ...payload, id: payload.sub };
  }
}