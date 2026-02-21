import { Injectable, Scope } from '@nestjs/common';
import { UserModel } from './user.model';
import { Permission, UsersEntity } from './users.entity';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';


// don't forget to implement db logic here, this is just a simple in-memory implementation for demonstration purposes
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
        if (createDTO.permission && !Object.values(Permission).includes(createDTO.permission)) {
            throw new BadRequestException(`Invalid permission value: ${createDTO.permission}`);
        }
        userEntity.permission = createDTO.permission ?? Permission.MEMBER;
        const createdUserEntity = await this.userRepository.save(userEntity)
        if (!createdUserEntity) {
            throw new Error('Failed to create user');
        }
        return this.entityToModel(createdUserEntity)
    }

    async deleteUser(id: number): Promise<void> {
        const deleteResult = await this.userRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }

    async updateUser(id: number, updateData: UpdateUserDto): Promise<UserModel> {
        const userEntity = await this.userRepository.findOneBy({ id: id });
        if (!userEntity) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        if (updateData.username) {
            userEntity.username = updateData.username;
        }
        if (updateData.email) {
            userEntity.email = updateData.email;
        }
        if (updateData.permission) {
            if (!Object.values(Permission).includes(updateData.permission)) {
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
