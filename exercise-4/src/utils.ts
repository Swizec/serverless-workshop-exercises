import chrome from "chrome-aws-lambda";

export async function getChrome() {
    let browser = null;
    try {
        browser = await chrome.puppeteer.launch({
            args: chrome.args,
            defaultViewport: {
                width: 1920,
                height: 1080,
                isMobile: true,
                deviceScaleFactor: 2,
            },
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
            ignoreHTTPSErrors: true,
        });
    } catch (err) {
        console.error("Error launching chrome");
        console.error(err);
    }
    return browser;
}
