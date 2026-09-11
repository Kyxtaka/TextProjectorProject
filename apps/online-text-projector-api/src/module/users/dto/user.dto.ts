import { ROLES } from "../../../common/constants/roles.constant";

export class UserDto {
    uuid: string
    id: number
    username: string
    email: string
    permission: ROLES
    createdAt: Date;
    updatedAt: Date; 
}