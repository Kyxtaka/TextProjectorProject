import { Module } from '@nestjs/common';
import { JwtAuthStrategy } from './jwt.s-authtrategy';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '1h' },
        }),
    })
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
    ],
    exports: [JwtAuthStrategy, JwtAuthService, JwtAuthGuard]
})
export class JwtAuthModule {}
