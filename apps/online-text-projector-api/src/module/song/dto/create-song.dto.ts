import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';

export class CreateSongSectionDto {
    @IsNotEmpty({ message: 'Le type de section est requis' })
    @IsString({ message: 'Le type de section doit être une chaîne de caractères' })
    type!: string;

    @IsNotEmpty({ message: 'Le contenu de la section est requis' })
    @IsString({ message: 'Le contenu de la section doit être une chaîne de caractères' })
    data!: string;

    @IsOptional()
    @IsInt({ message: 'L ordre doit être un entier' })
    @Min(1, { message: 'L ordre doit être supérieur ou égal à 1' })
    order?: number;
}

export class CreateSongDto {
    @IsNotEmpty({ message: 'Le titre est requis' })
    @IsString({ message: 'Le titre doit être une chaîne de caractères' })
    title!: string;

    @IsOptional()
    @IsString({ message: 'L artiste doit être une chaîne de caractères' })
    artist?: string;

    @IsOptional()
    @IsString({ message: 'L album doit être une chaîne de caractères' })
    album?: string;

    @IsOptional()
    @IsInt({ message: 'L année doit être un entier' })
    @Min(0, { message: 'L année doit être positive' })
    year?: number;

    @IsOptional()
    @IsArray({ message: 'content doit être un tableau' })
    @ArrayNotEmpty({ message: 'content ne peut pas être vide si envoyé' })
    @ValidateNested({ each: true })
    @Type(() => CreateSongSectionDto)
    content?: CreateSongSectionDto[];
}