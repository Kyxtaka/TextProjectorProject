import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SongService } from '../../module/song/song.service';
import { CreateSongDto } from '../../module/song/dto/create-song.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { mkdir, readFile, readdir, rename } from 'fs/promises';
import path from 'path';

type JsonSongFile = unknown[];

const dataDirectory = path.join(__dirname, 'data');
const archiveDirectory = path.join(dataDirectory, 'archive');

async function validateSongEntry(rawSong: unknown, fileName: string, index: number): Promise<CreateSongDto> {
    const songDto = plainToInstance(CreateSongDto, rawSong);
    const errors = await validate(songDto);

    if (errors.length > 0) {
        throw new Error(`Invalid song entry in ${fileName} at index ${index}: ${JSON.stringify(errors)}`);
    }

    return songDto;
}

async function archiveFile(filePath: string, fileName: string): Promise<void> {
    const archivedFileName = `${Date.now()}-${fileName}`;
    await rename(filePath, path.join(archiveDirectory, archivedFileName));
}

async function processSongFile(songService: SongService, fileName: string): Promise<void> {
    const filePath = path.join(dataDirectory, fileName);
    const rawContent = await readFile(filePath, 'utf-8');
    const parsedContent = JSON.parse(rawContent) as JsonSongFile;

    if (!Array.isArray(parsedContent)) {
        throw new Error(`File ${fileName} must contain a JSON array of songs`);
    }

    const validatedSongs: CreateSongDto[] = [];
    for (let index = 0; index < parsedContent.length; index += 1) {
        validatedSongs.push(await validateSongEntry(parsedContent[index], fileName, index));
    }

    if (validatedSongs.length === 0) {
        console.log(`No songs found in ${fileName}. Archiving file without insert.`);
        await archiveFile(filePath, fileName);
        return;
    }

    for (const songDto of validatedSongs) {
        await songService.createSong(songDto);
        console.log(`Song created: ${songDto.title}`);
    }

    await archiveFile(filePath, fileName);
    console.log(`Archived ${fileName}`);
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const songService = app.get(SongService);

    await mkdir(archiveDirectory, { recursive: true });

    const entries = await readdir(dataDirectory, { withFileTypes: true });
    const jsonFiles = entries
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.json'))
        .map((entry) => entry.name);

    if (jsonFiles.length === 0) {
        console.log('No song JSON files found to seed.');
        await app.close();
        return;
    }

    for (const fileName of jsonFiles) {
        try {
            await processSongFile(songService, fileName);
        } catch (error) {
            console.error(`❌ Error while processing ${fileName}:`, error);
        }
    }

    await app.close();
}

bootstrap().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});