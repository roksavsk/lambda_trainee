import * as AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const sqs = new AWS.SQS();
const lambda = new AWS.Lambda();

const store: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log(event);
    const data = event.body;
    const stores = ['UAmade', 'Converse', 'Cropp', 'New-Yorker', 'Funko-Pop'];
    const check = stores.includes(data.store);
    
    let count = 0;

    if (check) {
        async function getLimit() {
            const params = {
                FunctionName: 'redistribution-dev-mediator',
                InvocationType: 'RequestResponse',
                Payload: JSON.stringify(data),
            };
            const response = await lambda.invoke(params).promise();
            if (response.StatusCode !== 200) {
                throw new Error('Failed to get response from lambda function');
            }
            return JSON.parse(response.Payload.toString());
        }

        const response = await getLimit();
        const result = JSON.parse(response.body);
        console.log('Response', result);
        count = Number(result.count);
    }

    const limitCheck = count <= 1000;

    let message = '';
    if (check === true && limitCheck === true) {
        message = `Hello ${data.name}, welcome to the ${data.store}! You've searched for ${data.search}.`;
    } else if (check === false) {
        message = 'Unauthorized request.';
    } else if (check === true && limitCheck === false) {
        message = `You've reached maximum limit of requests to the ${data.store}.`;
    }

    if (check === true && limitCheck === true) {
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
        message: message,
    });
};

export const main = middyfy(store);
