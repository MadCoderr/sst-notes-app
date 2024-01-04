import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";

import { Table } from "sst/node/table";

import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamoDb";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  let data = {
    content: "",
    attachment: "",
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  // Federated Identity id (or Identity Pool user id)
  const userId =
    event.requestContext.authorizer?.iam.cognitoIdentity.identityId;

  const params = {
    TableName: Table.Notes.tableName,
    Item: {
      userId: userId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});

// export async function main(event: APIGatewayProxyEvent) {
//   let data;
//   let params;

//   // Request body is passed in as a JSON encoded string in 'event.body'
//   if (event.body) {
//     data = JSON.parse(event.body);

//     params = {
//       TableName: Table.Notes.tableName,
//       Item: {
//         userId: "123",
//         noteId: uuid.v1(),
//         content: data.content,
//         attachment: data.attachment,
//         createdAt: Date.now(),
//       },
//     };
//   } else {
//     return {
//       statusCode: 404,
//       body: JSON.stringify({ error: true }),
//     };
//   }

//   try {
//     await dynamoDb.put(params).promise();

//     return {
//       statusCode: 200,
//       body: JSON.stringify(params.Item),
//     };
//   } catch (error) {
//     let message;

//     if (error instanceof Error) {
//       message = error.message;
//     } else {
//       message = String(error);
//     }

//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: message }),
//     };
//   }
// }
