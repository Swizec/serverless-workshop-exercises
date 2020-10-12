import * as db from "simple-dynamodb";
import { APIGatewayEvent } from "aws-lambda";

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

    const result = await db.scanItems({
        TableName: process.env.UPVOTES_TABLE!,
        FilterExpression: "#itemId = :itemId",
        ExpressionAttributeNames: {
            "#itemId": 'itemId'
        },
        ExpressionAttributeValues: {
            ":itemId": itemId,
        },
    });
    
    if (result) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                count: result.Count,
            }),
        };
    } else {
        return {
            statusCode: 404,
            headers,
            body: "Item not found",
        };
    }
};
