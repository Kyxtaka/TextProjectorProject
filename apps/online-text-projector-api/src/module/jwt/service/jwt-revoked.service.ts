import {Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtRevokedEntity } from "../entity/jwt-revoked.entity";


@Injectable()
export class JwtRevokedService {
    constructor(
        @InjectRepository(JwtRevokedEntity)
        private readonly jwtRevokedRepository: any, // Remplacez 'any' par le type de votre repository
    ) { }

    public async isRevoked(token: string): Promise<boolean> {
        const existingRevokedToken = await this.jwtRevokedRepository.findOne({ where: { token } });
        return !!existingRevokedToken;
    }

    public async revokeToken(token: string): Promise<void> {
        const revokedToken = new JwtRevokedEntity();
        revokedToken.token = token;
        await this.jwtRevokedRepository.save(revokedToken);
    }
}