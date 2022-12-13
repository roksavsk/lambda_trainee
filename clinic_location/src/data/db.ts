import { PgConnector } from 'drizzle-orm-pg';
import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

const connector = new PgConnector(pool);

export default connector;