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
        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });

        const client = await pool.connect();
        console.log('Connected Successfully');

        const sqlTable = `CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL,
            username VARCHAR ( 50 ) UNIQUE NOT NULL PRIMARY KEY,
            password VARCHAR ( 50 ) NOT NULL,
            search VARCHAR ( 50 ) NOT NULL,
            store VARCHAR ( 50 ) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS stores (
            id SERIAL PRIMARY KEY, 
            store1 INT, 
            store2 INT, 
            store3 INT, 
            store4 INT, 
            store5 INT, 
            username VARCHAR ( 50 ) REFERENCES users(username)
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
                VALUES ('${body.name}', '${body.password}', '${body.search}', '${body.store}') 
                ON CONFLICT ON CONSTRAINT users_username_key DO NOTHING;`;
                console.log(sqlData);

                try {
                    const res = await client.query(sqlData);
                    console.log('Data was inserted', res);
                } catch (err) {
                    console.log(err.stack);
                } 

                const dict = {
                    'UAmade': 'store1',
                    'Converse': 'store2', 
                    'Cropp': 'store3', 
                    'New-Yorker': 'store4',
                    'Funko-Pop': 'store5',
                };
                
                const queryStore = `INSERT INTO stores ("${dict[body.store]}", username) VALUES (1, '${body.name}')`;
                try {
                    const res = await client.query(queryStore);
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
            VALUES ('${body.name}', '${body.password}', '${body.search}', '${body.store}') 
            ON CONFLICT ON CONSTRAINT users_username_key DO NOTHING;`;
            console.log(sqlData);

            try {
                const res = await client.query(sqlData);
                console.log('Data was inserted', res);
            } catch (err) {
                console.log(err.stack);
            } 

            const dict = {
                'UAmade': 'store1',
                'Converse': 'store2', 
                'Cropp': 'store3', 
                'New-Yorker': 'store4',
                'Funko-Pop': 'store5',
            };
            
            const queryStore = `INSERT INTO stores ("${dict[body.store]}", username) VALUES (1, '${body.name}')`;
            try {
                const res = await client.query(queryStore);
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
