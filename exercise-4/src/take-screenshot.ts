import { getChrome } from "./utils";

export const handler = async () => {
    const browser = await getChrome();

    if (!browser) {
        throw new Error("Couldn't instantiate chrome");
    }

    const page = await browser.newPage();
    await page.goto("https://swizec.com", {
        waitUntil: ["domcontentloaded", "networkidle2"],
    });

    const h1value = await page.$eval("h1", (el) => el.innerHTML);

    return {
        statusCode: 200,
        body: h1value,
    };
};
