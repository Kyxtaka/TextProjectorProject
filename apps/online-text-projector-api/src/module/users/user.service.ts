import { Injectable, Scope } from '@nestjs/common';
import { UserModel } from './user.model';
import { UsersEntity } from './users.entity';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ROLES } from '../../common/constants/roles.contants';


@Injectable({scope: Scope.DEFAULT}) // singleton
export class UserService {

    constructor(
        @InjectRepository(UsersEntity)
        private readonly userRepository: Repository<UsersEntity>
    ) { }

    async findAllUsers(search?: string): Promise<UserModel[]> {
        let where = {}
        if (search) {
            where = [
                { username: Like(`%${search}%`) },
                { email: Like(`%${search}%`) },
                { permission: Like(`%${search}%`) }
            ];
        }
        const allUsersEntities: UsersEntity[] = await this.userRepository.find({where})
        return allUsersEntities.map(user => this.entityToModel(user))
    }

    async findUserById(id: number): Promise<UserModel> {
        const userEntity: UsersEntity | null = await this.userRepository.findOneBy({ id: id });
        if (!userEntity) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return this.entityToModel(userEntity);
    }

    async findUserByEmail(email: string): Promise<UserModel> {
        const userEntity: UsersEntity | null = await this.userRepository.findOneBy({ email: email });
        if (!userEntity) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return this.entityToModel(userEntity);
    }

    async createUser(createDTO: CreateUserDto): Promise<UserModel> {
        const userEntity = new UsersEntity();
        userEntity.username = createDTO.username;
        userEntity.email = createDTO.email;
        if (createDTO.permission && !Object.values(ROLES).includes(createDTO.permission)) {
            throw new BadRequestException(`Invalid permission value: ${createDTO.permission}`);
        }
        userEntity.permission = createDTO.permission ?? ROLES.MEMBER;
        const createdUserEntity = await this.userRepository.save(userEntity)
        if (!createdUserEntity) {
            throw new Error('Failed to create user');
        }
        return this.entityToModel(createdUserEntity)
    }

    async deleteUser(id: number): Promise<boolean> {
        const deleteResult = await this.userRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return deleteResult.affected! > 0;
    }

    // async requestDeletion(id: number): Promise<boolean> {
    //     const userEntity = await this.userRepository.findOneBy({ id: id });
    //     if (!userEntity) {
    //         throw new NotFoundException(`User with id ${id} not found`);
    //     }
    //     userEntity.permission = ROLES.REQUEST_DELETION;
    //     const updatedUserEntity = await this.userRepository.save(userEntity);
    //     return updatedUserEntity.permission === ROLES.REQUEST_DELETION;
    // }

    async updateUser(id: number, updateData: UpdateUserDto): Promise<UserModel> {
        const userEntity = await this.userRepository.findOneBy({ id: id });
        if (!userEntity) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        if (updateData.username) {
            userEntity.username = updateData.username;
        }
        if (updateData.email) {
            const existingUser = await this.userRepository.findOneBy({ email: updateData.email });
            if (existingUser && existingUser.id !== id) {
                throw new BadRequestException(`Email ${updateData.email} is already taken`);
            }
            userEntity.email = updateData.email;
        }
        if (updateData.permission) {
            if (!Object.values(ROLES).includes(updateData.permission)) {
                throw new BadRequestException(`Invalid permission value: ${updateData.permission}`);
            }
            userEntity.permission = updateData.permission;
        }
        const updatedUserEntity = await this.userRepository.save(userEntity);
        return this.entityToModel(updatedUserEntity);
    }

    entityToModel(userEntity: UsersEntity): UserModel {
        return new UserModel(
            userEntity.id,
            userEntity.username,
            userEntity.email,
            userEntity.password,
            userEntity.permission,
            userEntity.createdAt,
            userEntity.updatedAt
        );
    }

    modelToEntity(userModel: UserModel): UsersEntity {
        const userEntity = new UsersEntity();
        userEntity.id = userModel.id;
        userEntity.username = userModel.username;
        userEntity.email = userModel.email;
        userEntity.password = userModel.password;
        userEntity.permission = userModel.permission;
        userEntity.createdAt = userModel.createdAt;
        userEntity.updatedAt = userModel.updatedAt;
        return userEntity;
    }

    modelToDto(userModel: UserModel): UserDto {
        return {
            id: userModel.id,
            username: userModel.username,
            email: userModel.email,
            permission: userModel.permission,
            createdAt: userModel.createdAt,
            updatedAt: userModel.updatedAt,
        };
    }
}
