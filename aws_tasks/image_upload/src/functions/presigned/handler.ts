import AWS from 'aws-sdk';
import { v4 } from 'uuid';
import type { APIGatewayEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';
import { formatJSONResponse } from '../../libs/api-gateway';

const s3 = new AWS.S3();
const bucketName = process.env.UPLOAD_BUCKET;
const dynamodb = new AWS.DynamoDB.DocumentClient();

const presigned = async (event: APIGatewayEvent) => {
    const email = event.requestContext.authorizer.claims.email;
    const imageId = v4();

    async function getUserId() {
        try {
            const result = await dynamodb.get({ TableName: 'Users', Key: { email: email } }).promise();
            return result.Item.id;
        } catch (error) {
            console.error(error);
        }
    }

    const userId = await getUserId();

    const params = {
        Bucket: bucketName,
        Fields: {
            key: `${userId}/${imageId}.jpeg`,
            acl: 'public-read',
        },
        Conditions: [
            ['content-length-range', 0, 10000000], // content length restrictions: 0-10MB
            ['starts-with', '$key', 'images/'],
            ['starts-with', '$Content-Type', 'image/'], // content type restriction
            { acl: 'public-read' },
        ],
    };

    const presignedPostData = {
        data: {},
    };

    s3.createPresignedPost(params, function (err, data) {
        if (err) {
            console.error('Presigning post data encountered an error: ', err);
        } else {
            console.log('Post data: ', data);
            presignedPostData.data = data;
            return;
        }
    });

    const imageS3Link = `https://s3.amazonaws.com/image-upload-serverless-task/${params.Fields.key}`;

    const newImage = {
        id: imageId,
        idUser: userId,
        imageLink: imageS3Link,
        created: new Date().toISOString(),
    };

    await dynamodb
        .put({ TableName: 'Images', Item: newImage })
        .promise()
        .catch(error => {
            console.log('Error', error);
        });

    return formatJSONResponse({
        status: 'success',
        message: `Email ${email} has been authorized`,
        s3Data: presignedPostData.data,
    });
};

export const main = middyfy(presigned);