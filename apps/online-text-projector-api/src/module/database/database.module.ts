import { Module } from '@nestjs/common';
import { databaseProviders } from 'src/module/database/providers/database.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [...databaseProviders,],
    exports: [...databaseProviders,],
})
export class DatabaseModule {}
