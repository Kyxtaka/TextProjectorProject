import { Injectable, Scope } from '@nestjs/common';
import { UserModel } from './user.model';
import { UsersEntity } from './users.entity';
import { UserDto } from './dto/user.dto';


// don't forget to implement db logic here, this is just a simple in-memory implementation for demonstration purposes
@Injectable({scope: Scope.DEFAULT}) // singleton
export class UserService {

    actualUserp: UserModel[]

    constructor() { 
        this.actualUserp = []
    }

    addUser(user: UserModel) {
        this.actualUserp.push(user)
        const test = new UserModel()
        console.log(`Added user. Total users: ${test}`)
    }

    getAllUsers(): UserModel[] {
        return this.actualUserp
    }

    convertToDto(user: UsersEntity): UserDto {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            permission: user.permission,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    findUserById(id: number): UserModel | undefined {
        return this.actualUserp.find(user => user.id === id)
    }
}
