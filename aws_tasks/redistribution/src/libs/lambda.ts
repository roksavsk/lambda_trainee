import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser())
}




// import middy from '@middy/core'
// import eventNormalizerMiddleware from '@middy/event-normalizer'
// import sqsPartialBatchFailure from '@middy/sqs-partial-batch-failure'

// export const middyfy = middy()
//   .use(eventNormalizerMiddleware())
//   .use(sqsPartialBatchFailure())
//   .handler((event, context, {signal}) => {
//     // ...
//   })

// import middy from "@middy/core"
// import middyJsonBodyParser from "@middy/http-json-body-parser"
// import httpHeaderNormalizer from '@middy/http-header-normalizer'
// import type {
//   APIGatewayProxyEvent,
//   APIGatewayProxyResult,
//   Callback,
//   Context,
// } from 'aws-lambda';

// // export const middyfy = (handler) => {
// //   return middy(handler).use(middyJsonBodyParser())
// // }

// export const middyfy = (
//   handler: {
//     (event: any, context: Context, callback: Callback<any>);
//   },
// //   validateSchema?: ObjectSchema,
// ) => {
//   return middy(handler)
//     .use(httpHeaderNormalizer())
//     .use(middyJsonBodyParser())
// };



// import middy from "@middy/core";
// import validator from "@middy/validator";
// import httpErrorHandler from "@middy/http-error-handler";
// import jsonBodyParser from "@middy/http-json-body-parser";

// const baseHandler = (event) => {
//   const { fname, lname } = event.body;
//   return {
//     statusCode: 200,
//     headers: { "Content-Type": "text/plain" },
//     body: `Hello, ${fname}-${lname}.`,
//   };
// };

// const inputSchema = {
//   type: "object",
//   properties: {
//     body: {
//       type: "object",
//       properties: {
//         fname: { type: "string" },
//         lname: { type: "string" },
//       },
//       required: ["fname", "lname"],
//     },
//   },
// };

// const outputSchema = {
//   type: "object",
//   required: ["body", "statusCode"],
//   properties: {
//     body: {
//       type: "string",
//     },
//     statusCode: {
//       type: "number",
//     },
//     headers: {
//       type: "object",
//     },
//   },
// };

// // const handler = middy(baseHandler)
// //   .use(jsonBodyParser())
// //   .use(
// //     validator({
// //       inputSchema,
// //       outputSchema,
// //     })
// //   )
// //   .use(httpErrorHandler());

// // export { handler };
// export const middyfy = (baseHandler) => {
//     return middy(baseHandler).use(jsonBodyParser())
//     .use(
//       validator({
//         inputSchema,
//         outputSchema,
//       })
//     )
//     .use(httpErrorHandler());
// }



// import middy from '@middy/core';
// import middyJsonBodyParser from '@middy/http-json-body-parser';
// import type {
//   APIGatewayProxyEvent,
//   APIGatewayProxyResult,
//   Callback,
//   Context,
// } from 'aws-lambda';
// import { ObjectSchema } from 'joi';

// import { ErrorBoom } from '../interface/interface';

// const middlewareJoiValidate = (
//   validateSchema?: ObjectSchema,
// ): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
//   const before: middy.MiddlewareFn = async (request): Promise<void> => {
//     if (request.event.body) {
//       try {
//         const value = await validateSchema.validateAsync(request.event.body);
//         console.log('value: ', value);
//       } catch (error) {
//         console.log(error);
//         // Initialize response
//         request.response = request.response ?? {};
//         // Add (.error) to response
//         request.response.error = `${error}`;
//         // Override an error
//         request.error = new Error(`Error joi validate ${error}`);
//         // handle the error
//         return request.response;
//       }
//     }
//   };
//   return { before };
// };

// const middlewareEditResponse = (): middy.MiddlewareObj<
//   APIGatewayProxyEvent,
//   APIGatewayProxyResult
// > => {
//   const after: middy.MiddlewareFn<
//     APIGatewayProxyEvent,
//     APIGatewayProxyResult
//   > = async (request): Promise<void> => {
//     const body = request.response;
//     request.response = {
//       body: JSON.stringify(body),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       statusCode: 200,
//     };
//   };

//   const onError: middy.MiddlewareFn<
//     APIGatewayProxyEvent,
//     APIGatewayProxyResult,
//     ErrorBoom
//   > = async (request): Promise<void> => {
//     console.log('*** onError ***: ', request);
//     console.log('*** onError ***: ', request.error);

//     const body = { error: { message: request.error.message || request.error } };
//     const statusCode = request.error.output.statusCode || 500;
//     request.response = {
//       body: JSON.stringify(body),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       statusCode: statusCode,
//     };
//   };
//   return { after, onError };
// };

// export const middyfy = (
//   handler: {
//     (event: any, context: Context, callback: Callback<any>);
//   },
//   validateSchema?: ObjectSchema,
// ) => {
//   return middy(handler)
//     .use(middyJsonBodyParser())
//     .use(middlewareJoiValidate(validateSchema))
//     .use(middlewareEditResponse());
// };