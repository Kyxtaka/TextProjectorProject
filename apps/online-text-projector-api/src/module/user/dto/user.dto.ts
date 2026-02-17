import { Permission } from "../entities/users.entity";

export class UserDto {
    id: number
    username: string
    email: string
    permission: Permission
    createdAt: Date;
    updatedAt: Date; 
}