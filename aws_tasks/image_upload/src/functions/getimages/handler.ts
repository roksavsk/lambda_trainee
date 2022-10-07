import AWS from 'aws-sdk';
import type { APIGatewayEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';
import { formatJSONResponse } from '../../libs/api-gateway';

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getimages = async (event: APIGatewayEvent) => {
    const email = event.requestContext.authorizer.claims.email;

    async function getUserId() {
        try {
            const params = {
                Key: {
                    'email': `${email}`, 
                }, 
                TableName: 'Users',
            };
            const result = await dynamodb.get(params).promise();
            return result.Item.id;
        } catch (error) {
            console.error(error);
        }
    }

    const userId = await  getUserId();

    async function getImagesList() {
        try {
            const params = {
                FilterExpression: 'idUser = :idUser',
                ExpressionAttributeValues: {
                    ':idUser': `${userId}`,
                },
                TableName: 'Images',
            };
            const result = await dynamodb.scan(params).promise();
            return result;
        } catch (error) {
            console.error(error);
        }
    }
    const imagesList = await getImagesList();

    return formatJSONResponse({
        status: 'success',
        message: 'Images successfully retrieved',
        userId,
        images: imagesList,
    });

};

export const main = middyfy(getimages);