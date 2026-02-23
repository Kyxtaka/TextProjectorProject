import { Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtIssuedEntity } from '../entity/jwt-issued.entity';
import { Repository } from 'typeorm';
import crypto from 'crypto';

@Injectable()
export class JwtAuthService { 
    constructor(
        private readonly jwtService: JwtService,
        
        @InjectRepository(JwtIssuedEntity)
        private readonly jwtIssuedRepository: Repository<JwtIssuedEntity>
    ) {}

    sign(payload: any): string {
        return this.jwtService.sign(payload);
    }



    async insertJwtIssued(jti: string, userId: number, issuedAt: Date, expiresAt: Date, type: string): Promise<JwtIssuedEntity> {
        // Implement the logic to insert the issued JWT details into the database
        // This is a placeholder and should be replaced with actual database interaction code
        console.log(`Inserting JWT Issued: jti=${jti}, userId=${userId}, issuedAt=${issuedAt}, expiresAt=${expiresAt}, type=${type}`);
        const uuid = crypto.randomUUID();
        const jwtIssued = {
            jti,
            userId,
            issuedAt,
            expiresAt,
            type,
        };
        const result = await this.jwtIssuedRepository.save(jwtIssued);
        console.log('JWT Issued saved to database:', result);
        return result;
        // Here you would typically use a repository or service to save jwtIssued to the database
    }


    getDeviceHash(userAgent: string, ipAddress: string): string {
        const hash = crypto.createHash('sha256');
        hash.update(userAgent + ipAddress);
        return hash.digest('hex');
    }
}   