export default () => ({
    // Server configuration
    server: (() => {
        const port = parseInt(process.env.PORT || '3000');
        const apiRootPath = process.env.API_ROOT_PATH || '/api/v1';
        const node_env = process.env.NODE_ENV || 'development';
        const isProduction = node_env === 'production';
        const isDevelopment = node_env === 'development';
        const isTest = node_env === 'test';
        const cors_origin = process.env.CORS_ORIGIN || '*';
        return {
            port,
            node_env,
            isProduction,
            isDevelopment,
            isTest,
            apiRootPath,
            cors_origin,
        };
    })(),

    // MySQL configuration
    database: (() => {
        const type = process.env.DB_TYPE || 'mysql';
        const host = process.env.DB_HOST || 'localhost';
        const port = parseInt(process.env.DB_PORT || '3306'); 
        const username = process.env.DB_USERNAME || 'root';
        const password = process.env.DB_PASSWORD || '';
        const database = process.env.DB_NAME || 'otp_database_dev';
        const synchronize = process.env.DB_SYNCHRONIZE === 'true';
        const logging = process.env.DB_LOGGING === 'false' ? false : true;
        return {
            type,
            host,
            port,
            username,
            password,
            database,
            synchronize,
            logging,
        };
    })(),

    // MongoDB configuration
    mongodb: (() => {
        const host = process.env.MONGO_HOST || 'localhost';
        const port = parseInt(process.env.MONGO_PORT || '27017');
        const username = process.env.MONGO_USERNAME || '';
        const password = process.env.MONGO_PASSWORD || '';
        const database = process.env.MONGO_DB_NAME || 'otpcontentdev';
        
        return {
            host,
            port,
            username,
            password,
            database,
            uri: `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`,
        };
    })(),

    // redis configuration
    redis: (() => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = parseInt(process.env.REDIS_PORT || '6379');
        return {
            host,
            port,
        };
    })(),

    // JWT configuration
    jwt: (() => {
        const secret = process.env.JWT_SECRET || 'default_secret';
        const accessExpiresIn = parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '86400'); // Default to 1 day
        const refreshExpiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '604800'); // Default to 7 days
        return {
            secret,
            accessExpiresIn,
            refreshExpiresIn,
        };
    })(),
});