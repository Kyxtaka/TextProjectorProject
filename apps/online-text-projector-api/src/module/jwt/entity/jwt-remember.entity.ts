import {Entity, Column, PrimaryGeneratedColumn, ForeignKey} from "typeorm";
import { UsersEntity } from "../../users/users.entity";

@Entity('jwt_remember')
export class JwtRememberEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ForeignKey(() => UsersEntity)
    idUser: number;

    @Column({ unique: true })
    token: string;
}