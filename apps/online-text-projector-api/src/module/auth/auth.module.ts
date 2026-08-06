import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthModule } from '../jwt/jwt-auth.module';


@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtService,
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
