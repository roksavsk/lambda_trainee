import * as AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const sqs = new AWS.SQS();

const store: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log(event);
    const data = event.body;
    const stores = ['UAmade', 'Converse', 'Cropp', 'New-Yorker', 'Funko-Pop'];
    const check = stores.includes(data.store);

    if (check === true) {
        console.log('Going to queue');          
        const params = {
            DelaySeconds: 2,
            MessageBody: JSON.stringify(event.body),
            QueueUrl: process.env.SQS_URL,
        };
        console.log(params);

        const queueRes = await sqs.sendMessage(params).promise();
        console.log(queueRes);
    }
    
    return formatJSONResponse({
        message: check
            ? `Hello ${data.name}, welcome to the ${data.store}! You've searched for ${data.search}.`
            : 'Unauthorized request.',
    });
};

export const main = middyfy(store);
