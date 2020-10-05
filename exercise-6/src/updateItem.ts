import { APIGatewayEvent } from "aws-lambda";
import * as db from "simple-dynamodb";

export const handler = async (event: APIGatewayEvent) => {
    const { itemId } = event.pathParameters as { itemId: string };

    if (!itemId) {
        return {
            statusCode: 400,
            body: "provide an itemId",
        };
    }

    if (!event.body) {
        return {
            statusCode: 400,
            body: "provide a json payload",
        };
    }

    const updatedAt = new Date().toISOString();
    const body = JSON.parse(event.body!);

    const item = await db.updateItem({
        TableName: process.env.ITEMS_TABLE!,
        Key: { itemId },
        UpdateExpression: `SET ${db.buildExpression(
            body
        )}, updatedAt = :updatedAt`,
        ExpressionAttributeValues: {
            ...db.buildAttributes(body),
            ":updatedAt": updatedAt,
        },
        ReturnValues: "ALL_NEW",
    });

    return {
        statusCode: 200,
        body: JSON.stringify(item.Attributes),
    };
};
