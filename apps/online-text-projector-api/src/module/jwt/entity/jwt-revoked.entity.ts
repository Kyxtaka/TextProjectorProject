import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('jwt_revoked')
export class JwtRevokedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;
}