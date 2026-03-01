import {Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtIssuedEntity } from "../../jwt/entity/jwt-issued.entity";
import { JwtService } from "@nestjs/jwt";
import { Repository, LessThan } from "typeorm";


@Injectable()
export class JwtRevokedService {
    constructor(
        @InjectRepository(JwtIssuedEntity)
        private readonly jwtIssuedRepository: Repository<JwtIssuedEntity>,
        private readonly jwtService: JwtService
    ) { }

    public async isRevokedByToken(token: string): Promise<boolean> {
        const tokenUuid = this.jwtService.decode(token)['jti'];
        const existingRevokedToken = await this.jwtIssuedRepository.findOne({ where: { jti: tokenUuid, isRevoked: true } });
        return !!existingRevokedToken;
    }

    public async isRevokedByJti(jti: string): Promise<boolean> {
        const existingRevokedToken = await this.jwtIssuedRepository.findOne({ where: { jti: jti, isRevoked: true } });
        return !!existingRevokedToken;
    }

    public async revokeTokenByToken(token: string): Promise<void> {
        const tokenUuid = this.jwtService.decode(token)['jti'];
        const revokedToken = await this.jwtIssuedRepository.findOne({ where: { jti: tokenUuid } });
        if (revokedToken) {
            revokedToken.isRevoked = true;
            revokedToken.revokedAt = new Date();
            await this.jwtIssuedRepository.save(revokedToken);
        }
    }

    public async revokeTokenByJti(jti: string): Promise<void> {
        const revokedToken = await this.jwtIssuedRepository.findOne({ where: { jti: jti } });
        if (revokedToken) {
            revokedToken.isRevoked = true;
            revokedToken.revokedAt = new Date();
            await this.jwtIssuedRepository.save(revokedToken);
        }
    }

    async revokeTokensByUserId(userId: number): Promise<void> {
        const revokedTokens = await this.jwtIssuedRepository.find({ where: { userId: userId, isRevoked: false } });
        for (const token of revokedTokens) {
            token.isRevoked = true;
            token.revokedAt = new Date();
            await this.jwtIssuedRepository.save(token);
        }
    }

    async deleteExpiredTokens(): Promise<void> {
        const now = new Date();
        await this.jwtIssuedRepository.delete({ expiresAt: LessThan(now) });
    }
}