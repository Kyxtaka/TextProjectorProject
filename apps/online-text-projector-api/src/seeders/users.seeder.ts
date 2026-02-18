import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserSeeder } from '../module/users/user-seeder.seeder';
// import inquirer from 'inquirer';
import * as bcrypt from 'bcrypt';
import { Permission } from '../module/users/users.entity';
import inquirer from 'inquirer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from '../module/users/dto/create-user.dto';

type UserAccountAnswer = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    permission: Permission;
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const userSeeder = app.get(UserSeeder);

    console.log('🌱 Creating user account...\n');
    const questions: Array<any> = [
        {
            type: 'input',
            name: 'username',
            message: 'Username:',
            validate: (input) => input.length > 0 || 'Username required',
        },
        {
            type: 'input',
            name: 'email',
            message: 'Email:',
            validate: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || 'Invalid email',
        },
        {
            type: 'password',
            name: 'password',
            message: 'Password:',
            mask: '*',
            validate: (input) => input.length >= 8 || 'Password must be at least 8 characters',
        },
        {
            type: 'password',
            name: 'confirmPassword',
            message: 'Confirm Password:',
            mask: '*',
            validate: (input, answers) => input === answers.password || 'Passwords do not match',
        },
        {
            type: 'list',
            name: 'permission',
            message: 'Permission Level:',
            choices: [
                { name: 'SUPER_ADMIN', value: Permission.SUPER_ADMIN },
                { name: 'ADMIN', value: Permission.ADMIN },
                { name: 'MEMBER', value: Permission.MEMBER },
            ],
            default: Permission.MEMBER,
        }
    ];

    const answers = await inquirer.prompt<UserAccountAnswer>(questions);

    const userCreateDto = plainToInstance(CreateUserDto, {
        username: answers.username,
        email: answers.email,
        password: answers.password,
        confirmPassword: answers.confirmPassword,
        permission: answers.permission,
    });
    const errors = await validate(userCreateDto);
    if (errors.length > 0) {
        console.error('Validation errors:', errors);
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(answers.password, 10);
    const user = {
        username: answers.username,
        email: answers.email,
        password: hashedPassword,
        confirmPassword: hashedPassword, // just to satisfy the DTO validation, it won't be used
        permission: answers.permission,
    };

    await userSeeder.createUser(user);
    console.log('✓ User account created successfully');

    await app.close();
}


bootstrap().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});