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
