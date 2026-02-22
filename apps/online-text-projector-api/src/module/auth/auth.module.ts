import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
// import { JwtStrategy } from '../jwt/jwt.s-authtrategy';
// import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
// import { APP_GUARD } from '@nestjs/core/constants';
// import { JwtAuthModule } from '../jwt/jwt-auth.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy,
    JwtService  
  ],
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtAuthModule
  ],
  exports: [AuthService]
})
export class AuthModule { }
