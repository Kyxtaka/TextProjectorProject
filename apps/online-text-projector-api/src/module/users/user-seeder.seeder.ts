import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserSeeder {

    constructor(
        @InjectRepository(UsersEntity)
        private readonly userRepository: Repository<UsersEntity>
    ) {}


    async createUser(userData: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({ 
            where: { email: userData.email } 
        });

        if (existingUser) {
            console.log(`User with email ${userData.email} already exists. Skipping...`)
            throw new Error(`User with email ${userData.email} already exists`);
        }

        const user = this.userRepository.create(userData)
        await this.userRepository.save(user)
        console.log(`User created: ${user.username}`)
        return user
    }
}