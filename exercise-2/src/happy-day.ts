// copypasta your Netlify function here
// add fixes to make TypeScript happy

import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
    let { name, emoji } = event.queryStringParameters as {
        name: string;
        emoji: string;
    };

    if (!name && event.body) {
        name = JSON.parse(event.body).name;
    }
    if (!emoji && event.body) {
        emoji = JSON.parse(event.body).emoji;
    }

    if (!name) {
        name = event.pathParameters?.name as string;
    }

    return {
        statusCode: 200,
        body: `Hello ${name}, beautiful day today ${emoji}`,
    };
};
