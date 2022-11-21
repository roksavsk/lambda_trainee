import { Pool } from 'pg';

import type { ValidatedEventAPIGatewayProxyEventModified } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const mediator: ValidatedEventAPIGatewayProxyEventModified<typeof schema> = async (event) => {
    console.log(event);
    const data = event;
    let count = 0;

    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });

    const dict = {
        'UAmade': 'store1',
        'Converse': 'store2', 
        'Cropp': 'store3', 
        'New-Yorker': 'store4',
        'Funko-Pop': 'store5',
    };

    try {
        const client = await pool.connect();
        console.log('Connected Successfully');

        const sqlQuery = `SELECT COUNT("${dict[data.store]}") FROM stores WHERE username = '${data.name}';`;
        try {
            const res = await client.query(sqlQuery);
            count = Number(res.rows[0].count);
            console.log(count);
            console.log('Data was retrieved', res);
        } catch (err) {
            console.log(err.stack);
        } finally {
            client.release();
        }
    } catch (err) {
        console.log('Failed to Connect Successfully', err);
        await pool.end();
        throw err;
    }

    await pool.end();

    return formatJSONResponse({
        count: count,
    });
};

export const main = middyfy(mediator);
