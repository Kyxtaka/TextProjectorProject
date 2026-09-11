import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, BeforeInsert } from 'typeorm';
import { randomUUID } from 'crypto';
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

    @Column({ type: 'char', length: 36, unique: true, nullable: true })
    uuid: string

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

    @BeforeInsert()
    private setUuid() {
        if (!this.uuid) {
            this.uuid = randomUUID();
        }
    }
}