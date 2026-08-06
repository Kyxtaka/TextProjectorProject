import { Controller, Post, Get, Body, UseGuards, Request, BadRequestException, Put } from '@nestjs/common';
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { JwtAuthGuard } from '../jwt/guard/jwt-auth.guard';
import { AllowAnonymous } from '../../common/decorators/allow-anonymous.decorator';
import { Allow } from 'class-validator';
import { use } from 'passport';


@Controller('songs')
export class SongController {
    constructor(private readonly songService: SongService) { }

    @AllowAnonymous()
    @Post()
    async createSong(@Body() createSongDto: CreateSongDto) {
        return this.songService.createSong(createSongDto);
    }

    @Put(':id')
    async updateSong(@Request() req) {
        const id = req.params.id;
        const updateSongDto = req.body;
        return this.songService.updateSong(id, updateSongDto);
    }

    @AllowAnonymous()
    @Get('search')
    async findAllSongs(@Request() req) {
        const search = req.query.search as string | undefined;
        if (search && search.trim() === '') {
            throw new BadRequestException('Search query cannot be empty');
        }
        return this.songService.findAllSongs(search);
    }

    @AllowAnonymous()
    @Get(':id')
    async findSongById(@Request() req) {
        const id = req.params.id;
        return this.songService.findSongById(id);
    }

    @AllowAnonymous()
    @Get()
    async getAllSongs() {
        return this.songService.getAllSongs();
    }

}
