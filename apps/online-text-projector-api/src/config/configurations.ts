export default () => ({
    // Server configuration
    server: (() => {
        const port = parseInt(process.env.PORT || '3000');
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
            cors_origin,
        };
    })(),

    // MySQL configuration
    database: (() => {
        const type = process.env.DB_TYPE || 'mysql';
        const host = process.env.DB_HOST || 'localhost';
        const port = parseInt(process.env.DB_PORT || '3306'); 
        const username = process.env.DB_USERNAME || 'root';
        const password = process.env.DB_PASSWORD || 'root';
        const database = process.env.DB_NAME || 'test';
        const synchronize = process.env.DB_SYNCHRONIZE === 'true';
        const logging = process.env.DB_LOGGING === 'true';
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
        const username = process.env.MONGO_USERNAME || 'root';
        const password = process.env.MONGO_PASSWORD || 'root';
        const database = process.env.MONGO_DB_NAME || 'test';
        
        return {
            host,
            port,
            username,
            password,
            database,
            uri: `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`,
        };
    })()
});