import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configurations';
import { UsersModule } from './module/users/users.module';
import { DatabaseModule } from './module/database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { SongModule } from './module/song/song.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [configurations],
    }),
    DatabaseModule,
    UsersModule,
    SongModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
