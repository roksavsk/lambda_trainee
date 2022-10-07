import AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const remove: ValidatedEventAPIGatewayProxyEvent<typeof schema>  = async (event) => {
    const email = event.requestContext.authorizer.claims.email;
    const imageId = event.body.id;

    async function getUserId() {
        try {
            const result = await dynamodb.get({ TableName: 'Users', Key: { email: email } }).promise();
            return result.Item.id;
        } catch (error) {
            console.error(error);
        }
    }

    const userId = await getUserId();

    await dynamodb
        .delete({
            TableName: 'Images',
            Key: {
                id: `${imageId}`,
            },
        })
        .promise()
        .then(data => console.log(data.Attributes))
        .catch(console.error);

    const bucketParams = { 
        Bucket: process.env.UPLOAD_BUCKET, 
        Key: `${userId}/${imageId}.jpeg`, 
    };

    await s3
        .deleteObject(bucketParams, function (err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(data);
            }
        })
        .promise()
        .catch(error => {
            console.log(error);
        });

    return formatJSONResponse({
        status: 'success',
        imageId: imageId,
        message: 'Image was deleted',
    });

};

export const main = middyfy(remove);