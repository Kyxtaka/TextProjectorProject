import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { DatabaseModule } from '../database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './song.schemas';
import { SongController } from './song.controller';
import { JwtAuthModule } from '../jwt/jwt-auth.module';

@Module({
    imports: [
        DatabaseModule,
        MongooseModule.forFeature(
            [{ name: Song.name, schema: SongSchema }]
        ),
        JwtAuthModule
    ],
    providers: [SongService],
    controllers: [SongController],
    exports: [SongService],
})
export class SongModule { }

