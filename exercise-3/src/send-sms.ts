import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountToken = process.env.TWILIO_ACCOUNT_TOKEN;

const client = twilio(accountSid, accountToken);

export const handler = async () => {
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
