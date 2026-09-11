import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtIssuedEntity } from '../entity/jwt-issued.entity';
import { Repository } from 'typeorm';
import { JWT_TYPE } from '../../../common/constants/jwt-type.constant';
import { Payload } from '../payload.object';

@Injectable()
export class JwtAuthService {
    constructor(
        private readonly jwtService: JwtService,

        @InjectRepository(JwtIssuedEntity)
        private readonly jwtIssuedRepository: Repository<JwtIssuedEntity>
    ) { }

    sign(payload: any): string {
        return this.jwtService.sign(payload);
    }

    signRefreshToken(payload: any): string {
        return this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token valid for 7 days
    }

    async insertJwtIssued(jti: string, userId: number, issuedAt: Date, expiresAt: Date, type: JWT_TYPE): Promise<JwtIssuedEntity> {
        console.log(`Inserting JWT Issued: jti=${jti}, userId=${userId}, issuedAt=${issuedAt}, expiresAt=${expiresAt}, type=${type}`);
        const jwtIssued = {
            jti: jti,
            userId: userId,
            issuedAt: issuedAt,
            expiresAt: expiresAt,
            type: type as JWT_TYPE,
        };
        const result = await this.jwtIssuedRepository.save(jwtIssued);
        console.log('JWT Issued saved to database:', result);
        return result;
    }

    async findJwtIssuedByJti(jti: string): Promise<JwtIssuedEntity | null> {
        return await this.jwtIssuedRepository.findOne({ where: { jti } });
    }

    async refreshTokenExists(jti: string): Promise<boolean> {
        const jwtIssued = await this.findJwtIssuedByJti(jti);
        return !!jwtIssued;
    }

    async verifyRefreshToken(refreshToken: string): Promise<Payload> {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const jwtIssued = await this.findJwtIssuedByJti(decoded.jti);
            if (!jwtIssued) {
                throw new Error('Refresh token not found in database');
            }
            if (jwtIssued.isRevoked) {
                throw new Error('Refresh token has been revoked');
            }
            return decoded;
        } catch (error) {
            console.error('Error verifying refresh token:', error);
            throw new Error('Invalid refresh token');
        }
    } 

    // getDeviceHash(userAgent: string, ipAddress: string): string {
    //     const hash = crypto.createHash('sha256');
    //     hash.update(userAgent + ipAddress);
    //     return hash.digest('hex');
    // }
}   