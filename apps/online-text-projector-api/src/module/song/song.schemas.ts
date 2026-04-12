import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SongDocument = HydratedDocument<Song>;

@Schema({ _id: false })
export class SongSection {
    @Prop({ required: true })
    type!: string;

    @Prop({ required: true })
    data!: string;

    @Prop({ required: false })
    order?: number;
}

export const SongSectionSchema = SchemaFactory.createForClass(SongSection);

@Schema()
export class Song {
    @Prop({ required: true })
    title!: string;

    @Prop()
    artist?: string;

    @Prop()
    album?: string;

    @Prop()
    year?: number;

    @Prop({ type: [SongSectionSchema], default: [] })
    content!: SongSection[];

}

export const SongSchema = SchemaFactory.createForClass(Song);