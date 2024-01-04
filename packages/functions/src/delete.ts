import { APIGatewayProxyEvent } from "aws-lambda";

import { Table } from "sst/node/table";

import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamoDb";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Table.Notes.tableName,

    Key: {
      // The attributes of the item to be updated
      userId: "123",
      noteId: event?.pathParameters?.id,
    },
  };

  await dynamoDb.delete(params);

  return JSON.stringify({ status: true });
});
