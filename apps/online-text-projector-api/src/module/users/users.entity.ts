import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { ROLES } from '../../common/constants/roles.constant';

// export enum Permission {
//   MEMBER = 'MEMBER',
//   ADMIN = 'ADMIN',
//   SUPER_ADMIN = 'SUPER_ADMIN',
// }

@Entity('users')
export class UsersEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string

    @Column()
    password: string

    @Column({ unique: true })
    email: string

    @Column({
        type: 'enum',
        enum: ROLES,
        default: ROLES.MEMBER,
    })
    permission: ROLES

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}