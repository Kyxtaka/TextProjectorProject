import { Permission } from "../users.entity";

export class UserDto {
    id: number
    username: string
    email: string
    permission: Permission
    createdAt: Date;
    updatedAt: Date; 
}