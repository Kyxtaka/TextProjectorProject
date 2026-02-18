import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from './database-config/database-config.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
    imports: [
        ConfigModule, 
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: DatabaseConfigService,
        }),
    ],
    providers: [DatabaseConfigService]
})
export class DatabaseModule {}
