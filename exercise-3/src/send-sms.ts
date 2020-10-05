import twilio from "twilio";
import { SecretsManager } from "aws-sdk";

const ssm = new SecretsManager({
    region: "us-east-1", // make sure this matches your region
});

async function getKeys() {
    try {
        const secret = await ssm
            .getSecretValue({
                SecretId: "twilioWorkshopKeys",
            })
            .promise();

        if (secret?.SecretString) {
            return JSON.parse(secret?.SecretString);
        } else {
            throw new Error("Couldn't get secrets");
        }
    } catch (err) {
        console.error("Error retrieving secrets");
        console.error(err);
        throw err;
    }
}

export const handler = async () => {
    const { TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_TOKEN } = await getKeys();

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_TOKEN);

    const msg = await client.messages.create({
        body: "hello from lambda",
        to: "+16505375963",
        from: "+13162519852",
    });
    return {
        statusCode: 200,
        body: JSON.stringify({
            sid: msg.sid,
        }),
    };
};
