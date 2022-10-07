import AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { formatJSONResponse } from '../../libs/api-gateway';

import schema from './schema';

const cognito = new AWS.CognitoIdentityServiceProvider();

const { USER_POOL_ID, CLIENT_ID } = process.env;

const signin: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async function (event) {
    const { email, password } = event.body;
    
    const params = {
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    };
    const response = await cognito.adminInitiateAuth(params).promise();
    return formatJSONResponse({
        message: 'Successfully signed in',
        token: response.AuthenticationResult.IdToken,
    });
};

export const main = middyfy(signin);