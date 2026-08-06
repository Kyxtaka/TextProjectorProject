import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { UserSeeder } from './user-seeder.seeder';
import { JwtAuthModule } from '../jwt/jwt-auth.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity]),
        JwtAuthModule
    ],
    providers: [UserService, UserSeeder],
    controllers: [UsersController],
    exports: [UserService]
})
export class UsersModule { }