import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { UserSeeder } from './user-seeder.seeder';


@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity])],
    providers: [UserService, UserSeeder],
    controllers: [UsersController],
    exports: [UserService]
})
export class UsersModule {}