import { IsEmail, IsNotEmpty, MinLength, Matches, IsString, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { Match } from '../validators/match.validator.js';
import { Permission } from '../entities/users.entity.js';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Le nom d\'utilisateur est requis' })
    @IsString()
    @Transform(({ value }) => value?.trim())
    username: string;

    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @Matches(/(?=(?:.*[A-Z]){2})/, { 
        message: 'Le mot de passe doit contenir au moins 2 lettres majuscules' 
    })
    @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { 
        message: 'Le mot de passe doit contenir au moins 1 caractère spécial' 
    })
    @Matches(/(?=(?:.*\d){4})/, { 
        message: 'Le mot de passe doit contenir au moins 4 chiffres' 
    })
    password: string;

    @IsNotEmpty({ message: 'La confirmation du mot de passe est requise' })
    @Match('password', { 
        message: 'Les mots de passe ne correspondent pas' 
    })
    confirmPassword: string;

    @IsEmail({}, { message: 'Email invalide' })
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @IsOptional()
    @IsEnum(Permission)
    permission?: Permission = Permission.MEMBER;
}