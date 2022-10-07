import AWS from 'aws-sdk';
import { v4 } from 'uuid';

import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const signup: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { email, password } = event.body;
    const { CLIENT_ID } = process.env;

    const params = {
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
        ],
    };

    const response = await cognito
        .signUp(params)
        .promise()
        .catch(error => {
            console.log(error);
        });

    console.log('Response: ', response);

    const newUser = {
        id: v4(),
        email: email,
    };
    await dynamodb
        .put({ TableName: 'Users', Item: newUser })
        .promise()
        .catch(error => {
            console.log(error);
        });

    return formatJSONResponse({
        status: 'success',
        message: 'User registration successful',
    });
};

export const main = middyfy(signup);