import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { DatabaseModule } from '../database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './song.schemas';

@Module({
    imports: [
        DatabaseModule,
        MongooseModule.forFeature(
            [{ name: Song.name, schema: SongSchema }]
        )
    ],
    providers: [SongService],
    exports: [SongService],
})
export class SongModule {}

