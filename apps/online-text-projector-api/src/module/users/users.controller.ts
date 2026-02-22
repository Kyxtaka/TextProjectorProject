import { Controller, Get, Param, Post, Query, Body, UseGuards, Put, Delete, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { Request } from '@nestjs/common';
import { AuthRole } from '../../common/decorators/auth-role.decorator';
import { ROLES } from '../../common/constants/roles.contants';
import { AuthRoleGuard } from '../auth/guard/authRole.guard';
@Controller('users')
export class UsersController {

    constructor(
        private readonly userService: UserService
    ) {}

    @Get(':id')
    @AuthRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)
    async getUserById(@Param('id') id: number): Promise<UserDto> {
        const user = await this.userService.findUserById(id);
        return this.userService.modelToDto(user);
    }

    @Put(':id')
    async updateUser(@Param('id') id: number, @Body() updateUserDto: CreateUserDto, @Request() req): Promise<UserDto> {
        if (req.user.id !== id && ![ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(req.user.role)) {
            throw new ForbiddenException(`You do not have the rights to update user with id ${id}`);
        }
        if (updateUserDto.permission && !req.user.role.includes(ROLES.SUPER_ADMIN, ROLES.ADMIN)) {
            throw new ForbiddenException(`You do not have the rights to update user permissions`); 
        }
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        return this.userService.modelToDto(updatedUser);
    }

    @Delete(':id')
    @AuthRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)
    async deleteUser(@Param('id') id: number): Promise<boolean> {
        const processed = await this.userService.deleteUser(id);
        if (!processed) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return true; 
    }

    @Get()
    @AuthRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)
    async getAllUsers(@Query('search') search?: string): Promise<UserDto[]> {
        const users = await this.userService.findAllUsers(search);
        return users.map(user => this.userService.modelToDto(user));
    }

    @Post()
    @AuthRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.modelToDto(user);
    }    
}
