import { Controller, Get, Param, Post, Query, Body, UseGuards } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Request } from '@nestjs/common';

@Controller('users')
export class UsersController {

    constructor(
        private readonly userService: UserService
    ) {}

    @Get('test')
    getHello(): string {
        return 'Hello World!';
    }

    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<UserDto> {
        const user = await this.userService.findUserById(id);
        return this.userService.modelToDto(user);
    }

    @Get()
    async getAllUsers(@Query('search') search?: string): Promise<UserDto[]> {
        const users = await this.userService.findAllUsers(search);
        return users.map(user => this.userService.modelToDto(user));
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.modelToDto(user);
    }

    
}
