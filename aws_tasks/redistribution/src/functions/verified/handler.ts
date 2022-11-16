import type { SQSEvent } from 'aws-lambda';
import { Pool } from 'pg';

import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

const verified = async (event: SQSEvent) => {
    console.log(event);

    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });

    try {
        const client = await pool.connect();
        console.log('Connected Successfully');

        const sqlTable = `CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR ( 50 ) UNIQUE NOT NULL,
            password VARCHAR ( 50 ) NOT NULL,
            search VARCHAR ( 50 ) NOT NULL,
            store VARCHAR ( 50 ) NOT NULL
        );`;

        try {
            const res = await client.query(sqlTable);
            console.log('Tables were created', res);
        } catch (err) {
            console.log(err.stack);
        }

        if (event.Records.length > 1) {
            for (let i = 0; i < event.Records.length; i++) {
                const messageData = event.Records[i].body;
                const body = JSON.parse(messageData);
                console.log(body);

                const sqlData = `INSERT INTO users (username, password, search, store) 
                VALUES ('${body.name}', '${body.password}', '${body.search}', '${body.store}');`;
                console.log(sqlData);

                try {
                    const res = await client.query(sqlData);
                    console.log('Data was inserted', res);
                } catch (err) {
                    console.log(err.stack);
                } finally {
                    if (event.Records.length - i === 1) {
                        client.release();
                    }
                }

            }
        } else {
            const messageData = event.Records[0].body;
            const body = JSON.parse(messageData);
            console.log(body);

            const sqlData = `INSERT INTO users (username, password, search, store) 
            VALUES ('${body.name}', '${body.password}', '${body.search}', '${body.store}');`;
            console.log(sqlData);

            try {
                const res = await client.query(sqlData);
                console.log('Data was inserted', res);
            } catch (err) {
                console.log(err.stack);
            } finally {
                client.release();
            }
      
        }

    } catch (err) {
        console.log('Failed to Connect Successfully', err);
        await pool.end();
        throw err;
    }

    await pool.end();
  
    return formatJSONResponse({
        statusCode: 200,
        message: 'Data was saved',
    });
};

export const main = middyfy(verified);
