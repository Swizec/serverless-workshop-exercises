import * as db from "simple-dynamodb";
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
    const { itemId } = event.pathParameters as { itemId: string };

    if (!itemId) {
        return {
            statusCode: 400,
            body: "provide an itemId",
        };
    }

    const item = await db.getItem({
        TableName: process.env.ITEMS_TABLE!,
        Key: { itemId },
    });

    if (item?.Item) {
        return {
            statusCode: 200,
            body: JSON.stringify(item.Item),
        };
    } else {
        return {
            statusCode: 404,
            body: "Item not found",
        };
    }
};
