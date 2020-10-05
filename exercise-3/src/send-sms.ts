import twilio from "twilio";

const accountSid = "AC1c1db52be590e54e507969ae5c0b800a";
const accountToken = "a01feece54a9c3efde8149c91517cc27";

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
