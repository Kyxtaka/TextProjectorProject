import { PrimaryGeneratedColumn, Column, ForeignKey, Entity } from "typeorm";
import { UserEntity } from "../../user/entity/user.entity";
import { JWT_TYPE } from "../../common/constants/jwt-type.constant";
@Entity('jwt_issued')
export class JwtIssuedEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string; // Unique identifier for the JWT issued record

    @Column()
    jti: string; // JWT ID

    @Column()
    @ForeignKey(() => UserEntity) // Assuming you have a UserEntity defined
    userId: number; // User ID associated with the JWT

    @Column({ type: 'timestamp' })
    issuedAt: Date; // Issued at time

    @Column({ type: 'timestamp' })
    expiresAt: Date; // Expiration time

    @Column({ type: 'timestamp', nullable: true })
    revokedAt: Date | null; // Revocation time (null if not revoked)

    @Column({ default: false })
    isRevoked: boolean;

    @Column({ type: 'enum', enum: JWT_TYPE })
    type: JWT_TYPE;
}