import { getChrome } from "./utils";
import fs from "fs";

export const handler = async () => {
    const browser = await getChrome();

    if (!browser) {
        throw new Error("Couldn't instantiate chrome");
    }

    const page = await browser.newPage();
    await page.goto("https://swizec.com", {
        waitUntil: ["domcontentloaded", "networkidle2"],
    });

    const element = await page.$("h1");
    const boundingBox = await element?.boundingBox();

    if (!boundingBox) {
        return {
            statusCode: 500,
            body: "Error measuring body",
        };
    }

    console.log(boundingBox);

    const imagePath = `/tmp/screenshot-${new Date().getTime()}.png`;

    await page.screenshot({
        path: imagePath,
        clip: boundingBox,
    });

    const data = fs.readFileSync(imagePath).toString("base64");

    console.log(data);

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "image/png",
        },
        body: data,
        isBase64Encoded: true,
    };
};
