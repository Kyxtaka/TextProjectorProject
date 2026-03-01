import { JWT_TYPE } from "../../common/constants/jwt-type.constant";
export class Payload {
    email: string;
    sub: number;
    role: string;
    jti: string; // JWT ID
    jwt_type : JWT_TYPE; // JWT Type (e.g., 'access' or 'refresh')
    iat?: number; // Issued at timestamp
    exp?: number; // Expiration timestamp
}
