import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";

import { Table } from "sst/node/table";

import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamoDb";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  const params = {
    TableName: Table.Notes.tableName,
    // 'Key' defines the partition key and sort key of // the item to be retrieved
    Key: {
      userId: "123",
      noteId: event?.pathParameters?.id,
    },
  };

  const result = await dynamoDb.get(params);

  if (!result.Item) {
    throw new Error("Item not found.");
  }

  return JSON.stringify(result.Item);
});
