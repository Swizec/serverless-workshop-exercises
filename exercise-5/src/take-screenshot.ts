import { getChrome } from "./utils";
import fs from "fs";
import util from "util";
import { S3 } from "aws-sdk";

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

    const screenshotName = `screenshot-${new Date().getTime()}.png`;
    const imagePath = `/tmp/${screenshotName}`;

    await page.screenshot({
        path: imagePath,
        clip: boundingBox,
    });

    const readFile = util.promisify(fs.readFile);
    const buffer = await readFile(imagePath);

    // aws comes from importing aws-sdk
    const s3 = new S3({
        apiVersion: "2006-03-01",
    });

    const { Location } = await s3
        .upload({
            Bucket: process.env.CF_ScreenshotsBucket!,
            Key: screenshotName,
            Body: buffer,
            ACL: "public-read",
        })
        .promise();

    return {
        statusCode: 200,
        body: Location,
    };
};
