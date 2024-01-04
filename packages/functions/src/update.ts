import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";

import { Table } from "sst/node/table";

import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamoDb";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  const data = JSON.parse(event.body || "{}");

  const userId =
    event.requestContext.authorizer?.iam.cognitoIdentity.identityId;

  const params = {
    TableName: Table.Notes.tableName,

    Key: {
      // The attributes of the item to be updated
      userId: userId,
      noteId: event?.pathParameters?.id,
    },

    // 'UpdateExpression' defines the attributes to be updated
    UpdateExpression: "SET content = :content, attachment = :attachment",

    // 'ExpressionAttributeValues' defines the value in the update expression
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":content": data.content || null,
    },

    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update
    // you can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(params);

  return JSON.stringify({ status: true });
});
