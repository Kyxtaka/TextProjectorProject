import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from './database-config/database-config.service';

@Module({
    imports: [ConfigModule],
    providers: [DatabaseConfigService]
})
export class DatabaseModule {}
