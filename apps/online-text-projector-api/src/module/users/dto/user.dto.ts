import { ROLES } from "../../../common/constants/roles.contants";

export class UserDto {
    id: number
    username: string
    email: string
    permission: ROLES
    createdAt: Date;
    updatedAt: Date; 
}