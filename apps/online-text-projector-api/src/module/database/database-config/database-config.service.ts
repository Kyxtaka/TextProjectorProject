import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { UsersEntity } from '../../users/users.entity';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {

    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        const config: TypeOrmModuleOptions = {
            type: this.configService.get<string>('database.type') as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mongodb' | 'oracle' | 'mssql',
            host: this.configService.get<string>('database.host'),
            port: this.configService.get<number>('database.port'),
            username: this.configService.get<string>('database.username'),
            password: this.configService.get<string>('database.password'),
            database: this.configService.get<string>('database.database'),
            entities: [UsersEntity],
            synchronize: this.configService.get<boolean>('database.synchronize') || false, // please use migration in production instead of synchronize: true
            logging: this.configService.get<boolean>('database.logging') || false,
            name: connectionName || 'default',
        };
        return config;
    }
}
