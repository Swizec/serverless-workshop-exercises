import { APIGatewayEvent } from "aws-lambda";
import * as db from "simple-dynamodb";
import { v4 as uuid } from 'uuid'

const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
}

export const handler = async (event: APIGatewayEvent) => {
    const { itemId } = event.pathParameters as { itemId: string };

    if (!itemId) {
        return {
            statusCode: 400,
            body: "provide an itemId",
        };
    }

    const votedAt = new Date().toISOString();
    const voteId = uuid()

    const item = await db.updateItem({
        TableName: process.env.UPVOTES_TABLE!,
        Key: { itemId, voteId },
        UpdateExpression: `SET votedAt = :votedAt`,
        ExpressionAttributeValues: {
            ":votedAt": votedAt,
        },
        ReturnValues: "ALL_NEW",
    });

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(item.Attributes),
    };
};
