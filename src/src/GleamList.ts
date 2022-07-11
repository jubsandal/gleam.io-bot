import puppeteer from 'puppeteer'
import { getMethodName } from "./libs/helpers.js"
import * as selector from './libs/selector.js'

import { sleep } from './libs/utils.js'

export async function getGiveawaysWithMethod(browser: puppeteer.Browser, searchedMethod: string) {
    const page = (await browser.pages())[1];
    await page.goto('http://gleamlist.com/?page=1');

    await sleep(2000)

    const rawhrefs = await page.evaluate(
        () => Array.from(
            document.querySelectorAll('a[href]'),
            a => a.getAttribute('href'),
        )
    );

    let hrefs = new Array<string>();
    for (const href of rawhrefs) {
        if (href?.includes("gleam.io")) {
            hrefs.push(href);
        }
    }

    let foundGiveaways = new Array<string>();

    for (let i = 0; i < 1; i++) {
        await page.goto(hrefs[i]);
        let entryMethods = await page.$$(selector.em);
        for (const method of entryMethods) {
            let methodName = await getMethodName(page, method);
            if (methodName == searchedMethod) {
                await foundGiveaways.push(hrefs[i]);
                break;
            }
        }
    }
    console.log("Found giveways:", foundGiveaways);
    return foundGiveaways;
}

export async function getGiveaways(browser: puppeteer.Browser, amount: number, pageNumber: number) {
    const page = (await browser.pages())[1];
    await page.goto('http://gleamlist.com/?page=' + pageNumber, { waitUntil: "domcontentloaded" });

    await sleep(1000)

    const rawhrefs = await page.evaluate(
        () => Array.from(
            document.querySelectorAll('a[href]'),
            a => a.getAttribute('href'),
        )
    );

    let hrefs = new Array<string>();
    for (let i = 0; i < rawhrefs.length; i++) {
        if (rawhrefs[i] != null && rawhrefs[i]?.includes("gleam.io")) {
            hrefs.push(<string>rawhrefs[i]);
        }
        if (hrefs.length == amount) {
            break;
        }
    }
    console.log("Found actions:", hrefs.length);

    return hrefs;
    // console.log(hrefs);
}
