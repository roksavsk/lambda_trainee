import type { Callback } from 'aws-lambda';

exports.handler = async (event, context, callback: Callback) => {

    event.response.autoConfirmUser = true;

    if (event.request.userAttributes.hasOwnProperty('email')) {
        event.response.autoVerifyEmail = true;
    }

    callback(null, event);
};