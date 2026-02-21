import { UserDto } from "./dto/user.dto"
import { Permission } from "./users.entity"

export class UserModel {
    id: number
    createdAt: Date
    updatedAt: Date
    username: string
    email: string
    password: string
    permission: Permission

    constructor(
        id: number,
        username: string,
        email: string,
        password: string,
        permission: Permission,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.permission = permission;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    getDateCreationAgo(): string {
        const now = new Date()
        const diff = now.getTime() - this.createdAt.getTime()
        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ago`
        } 
    }

    getDateUpdateAgo(): string {
        const now = new Date()
        const diff = now.getTime() - this.updatedAt.getTime()
        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ago`
        }
    }

    toDto(): UserDto {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            permission: this.permission,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
