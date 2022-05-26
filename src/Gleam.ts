import puppeteer from 'puppeteer'
import { grind } from './Grind.js'
import * as gleam from './GleamList.js'
// @ts-ignore
import { proxyRequest } from 'puppeteer-proxy'

import { Config } from './Config.js'

async function setupPage(browser: puppeteer.Browser) {
    let page = await browser.newPage();

    if (Config().proxy.length) {
        await page.setRequestInterception(true)

        function randomProxy(): string {
            let proxy = Config().proxy.at(0+Math.floor(Math.random() * Config().proxy.length) )
            if (!proxy) {
                return randomProxy()
            }
            return "http://" + proxy.user + ":" + proxy.password + "@" + proxy.host;
        }

        page.on('request', async (request) => {
            await proxyRequest({
                page: page,
                proxyUrl: randomProxy(),
                request,
            });
        });
    }

    await page .setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')
    await page.setViewport({ width: 1920, height: 1060 })
    await page.setDefaultNavigationTimeout(500000);
    await page.on('dialog', async (dialog: puppeteer.Dialog) => {
        await dialog.accept()
    });
    await page.on('error', async (err) => {
        const errorMessage = err.toString()
        console.log('browser error: ' + errorMessage)
    });
    await page.on('pageerror', async (err: any) => {
        const errorMessage = err.toString()
        console.log('browser this.page error: ' + errorMessage)
    });
}

async function setupBrowser() {
    let pupOpts = () => {
        return {
            headless: Config().headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
            ]
        }
    }
    let browser = await puppeteer.launch(pupOpts());
    await setupPage(browser)
    return browser
}

(async () => {
    Config()

    let howManyPages = 0
    for (let i = 0; i < 19; i++) {
        let browser = await setupBrowser()
        let result = await gleam.getGiveaways(browser, 100, i);
        await browser.close()
        for (const link of result) {
            let browser = await setupBrowser()
            try {
                await grind(browser, link);
            } catch (error) {}
            howManyPages++;
            console.log('Served pages: ' + howManyPages);
            await browser.close()
        }
    }
})();
