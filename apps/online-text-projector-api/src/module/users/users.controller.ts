import { Controller, Get, Param, Post, Query, Body, UseGuards, Put, Delete, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../jwt/guard/jwt-auth.guard';
import { Request } from '@nestjs/common';
import { AuthRole } from '../../common/decorators/auth-role.decorator';
import { ROLES } from '../../common/constants/roles.contants';
import { AuthRoleGuard } from '../auth/guard/authRole.guard';
import { UpdateUserDto } from './dto/update-user.dto';
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
    async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req): Promise<UserDto> {
        // Debug logs
        console.log('Request user in updateUser:', req.user);
        console.log('typeof req.user.sub:', typeof req.user?.sub, 'typeof id:', typeof id);
        console.log('is user id in updateUser:', req.user?.sub);
        console.log('is payload user roles in admin roles:', [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(req.user?.role));

        const tempUser = await this.userService.findUserById(id);
        if (!tempUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        const isSelf = req.user.sub === Number(id);
        const isAdmin = req.user.role === ROLES.ADMIN;
        const isSuperAdmin = req.user.role === ROLES.SUPER_ADMIN;
        const isPermissionUpdate = !!updateUserDto.permission;

        // 1. Un membre ne peut modifier que son profil
        if (!isSelf && !isAdmin && !isSuperAdmin) {
            throw new ForbiddenException(`You do not have the rights to update user with id ${id} (This is not your user profile)`);
        }

        // 2. Seuls admin/super-admin peuvent modifier les permissions
        if (isPermissionUpdate && !isAdmin && !isSuperAdmin) {
            throw new ForbiddenException(`You do not have the rights to update user permissions (Only ADMIN and SUPER_ADMIN can update user permissions)`);
        }

        // 3. Protection des permissions SUPER_ADMIN
        if (
            tempUser.permission === ROLES.SUPER_ADMIN &&
            isPermissionUpdate &&
            updateUserDto.permission !== ROLES.SUPER_ADMIN &&
            !isSuperAdmin
        ) {
            throw new ForbiddenException(`You do not have the rights to update SUPER_ADMIN permissions (SUPER_ADMIN permissions can only be updated by another SUPER_ADMIN)`);
        }

        // 4. Protection des permissions ADMIN
        if (
            tempUser.permission === ROLES.ADMIN &&
            isPermissionUpdate &&
            updateUserDto.permission !== ROLES.ADMIN &&
            !isSuperAdmin
        ) {
            throw new ForbiddenException(`You do not have the rights to update ADMIN permissions (ADMIN permissions can only be updated by a SUPER_ADMIN)`);
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
