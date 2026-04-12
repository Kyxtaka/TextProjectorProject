import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song, SongDocument } from './song.schemas';

@Injectable()
export class SongService {
    constructor(
        @InjectModel(Song.name)
        private readonly songModel: Model<Song>
    ) {}

    async findAllSongs(search?: string): Promise<SongDocument[]> {
        if (!search) {
            return this.songModel.find().exec();
        }

        const searchRegex = new RegExp(search, 'i');
        return this.songModel
            .find({
                $or: [
                    { title: searchRegex },
                    { artist: searchRegex },
                    { album: searchRegex },
                    { 'content.type': searchRegex },
                    { 'content.data': searchRegex },
                ],
            })
            .exec();
    }

    async findSongById(id: string): Promise<SongDocument> {
        const song = await this.songModel.findById(id).exec();
        if (!song) {
            throw new NotFoundException(`Song with id ${id} not found`);
        }
        return song;
    }

    async createSong(createSongDto: CreateSongDto): Promise<SongDocument> {
        if (createSongDto.year !== undefined && createSongDto.year < 0) {
            throw new BadRequestException('L année doit être positive');
        }

        const createdSong = await this.songModel.create({
            title: createSongDto.title,
            artist: createSongDto.artist,
            album: createSongDto.album,
            year: createSongDto.year,
            content: createSongDto.content ?? [],
        });

        return createdSong;
    }

    async updateSong(id: string, updateSongDto: UpdateSongDto): Promise<SongDocument> {
        const song = await this.songModel.findById(id).exec();
        if (!song) {
            throw new NotFoundException(`Song with id ${id} not found`);
        }

        if (updateSongDto.title !== undefined) {
            song.title = updateSongDto.title;
        }
        if (updateSongDto.artist !== undefined) {
            song.artist = updateSongDto.artist;
        }
        if (updateSongDto.album !== undefined) {
            song.album = updateSongDto.album;
        }
        if (updateSongDto.year !== undefined) {
            if (updateSongDto.year < 0) {
                throw new BadRequestException('L année doit être positive');
            }
            song.year = updateSongDto.year;
        }
        if (updateSongDto.content !== undefined) {
            song.content = updateSongDto.content;
        }

        return song.save();
    }

    async deleteSong(id: string): Promise<boolean> {
        const deleteResult = await this.songModel.findByIdAndDelete(id).exec();
        if (!deleteResult) {
            throw new NotFoundException(`Song with id ${id} not found`);
        }
        return true;
    }
}