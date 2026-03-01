import { Module } from '@nestjs/common';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { JwtAuthService } from './service/jwt-auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { JwtModule } from '@nestjs/jwt';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRevokedService } from './service/jwt-revoked.service';
import { JwtIssuedEntity } from './entity/jwt-issued.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '1h' },
      }),
    }),
    TypeOrmModule.forFeature([JwtIssuedEntity]),
  ],
  controllers: [],
  providers: [
    JwtAuthStrategy,
    JwtAuthService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtRevokedService,
  ],
  exports: [JwtAuthStrategy, JwtAuthService, JwtAuthGuard, JwtRevokedService],
})
export class JwtAuthModule {}
