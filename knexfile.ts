import type {Knex} from "knex";
import 'dotenv/config';

const knexConfig: { [key: string]: Knex.Config } = {
    test: {
        client: 'sqlite3',
        connection: {
            filename: ":memory:",
        },
        migrations: {
            extension: 'ts',
            directory: './server/database/migrations'
        },
        seeds: {
            extension: 'ts',
            directory: './server/database/seeds'
        },
        useNullAsDefault: true
    },
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
        },
        migrations: {
            extension: 'ts',
            directory: './server/database/migrations'
        },
        seeds: {
            extension: 'ts',
            directory: './server/database/seeds'
        }
    }
};

export default knexConfig;
