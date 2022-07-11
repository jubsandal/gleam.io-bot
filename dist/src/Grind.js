import { getMethodName, checkIfAvailable, passVerification, } from './libs/helpers.js';
import * as selector from './libs/selector.js';
import * as methods from './libs/methods/methods.js';
import * as facebook from './libs/methods/facebook.js';
import * as instagram from './libs/methods/instagram.js';
import * as youtube from './libs/methods/youtube.js';
import * as twitter from './libs/methods/twitter.js';
import * as twitch from './libs/methods/twitch.js';
import * as custom from './libs/methods/custom.js';
import * as wallet from './libs/methods/wallet.js';
import { randSleep } from './libs/utils.js';
async function solvegiveway(page, profile) {
    await randSleep();
    await passVerification(page);
    for (let i = 0; i < 2; i++) {
        let entryMethods = await page.$$(selector.emVisible);
        console.log("Pass methods count:", entryMethods.length);
        for (const entryMethod of entryMethods) {
            let methodName = await getMethodName(page, entryMethod);
            switch (methodName) {
                case "###APP_NAME### Click|wallet|address": {
                    console.log('✔️  ' + methodName);
                    await wallet.enter(page, entryMethod, profile.wallet);
                    break;
                }
                case '###APP_NAME### Click|facebook|visit': {
                    console.log('✔️  ' + methodName);
                    await facebook.visit(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|instagram|visit_profile': {
                    console.log('✔️  ' + methodName);
                    await instagram.visit(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|youtube|visit_channel': {
                    console.log('✔️  ' + methodName);
                    await instagram.visit(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|facebook|enter': {
                    console.log('✔️  ' + methodName);
                    await facebook.enter(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|youtube|enter': {
                    console.log('✔️  ' + methodName);
                    await youtube.enter(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|instagram|enter': {
                    console.log('✔️  ' + methodName);
                    await instagram.enter(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|email|subscribe': {
                    console.log('✔️  ' + methodName);
                    await methods.enter(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|twitter|follow': {
                    console.log('✔️  ' + methodName);
                    await twitter.follow(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|twitter|tweet': {
                    console.log('✔️  ' + methodName);
                    await twitter.tweet(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|twitter|retweet': {
                    console.log('✔️  ' + methodName);
                    await twitter.tweet(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|twitchtv|follow': {
                    console.log('✔️  ' + methodName);
                    await twitch.follow(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|instagram|view_post': {
                    console.log('✔️  ' + methodName);
                    await instagram.view(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|facebook|view_post': {
                    console.log('✔️  ' + methodName);
                    await facebook.view(page, entryMethod);
                    break;
                }
                default: {
                    if (methodName.includes('###CUSTOM###')) {
                        await custom.custom(page, entryMethod, methodName);
                    }
                    else {
                        console.log("❌ " + methodName);
                    }
                    break;
                }
            }
            await randSleep();
        }
        await randSleep();
    }
}
export async function grind(browser, url, profile) {
    const _pages = await browser.pages();
    let page;
    if (_pages.length < 2) {
        page = await browser.newPage();
    }
    else {
        page = _pages[1];
    }
    await page.setViewport({ width: 1920, height: 1060 });
    await page.setDefaultNavigationTimeout(500000);
    page.on('error', async (err) => {
        const errorMessage = err.toString();
        console.log('browser error: ' + errorMessage);
    });
    page.on('pageerror', async (err) => {
        const errorMessage = err.toString();
        console.log('browser this.page error: ' + errorMessage);
    });
    await page.goto(url);
    console.log("Going to action:", url);
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await randSleep();
    let err = false;
    if ((await checkIfAvailable(page)) == false) {
        console.log("Checking for reCapcha");
        try {
            let popup = await Promise.race([
                (() => new Promise((resolve) => page.once("popup", resolve)))(),
                (() => new Promise((_, reject) => {
                    setTimeout(() => reject(null), 5000);
                }))()
            ]);
            if (popup) {
                const ret = await popup.solveRecaptchas();
                if (ret.error) {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        catch (e) {
            console.log(e);
        }
        let twitterLoginBtn = await page.$('a[data-track-event="###APP_NAME### Login|twitter"]');
        if (twitterLoginBtn) {
            let [popup] = await Promise.all([
                (() => new Promise((resolve) => {
                    page.once("popup", resolve);
                }))(),
                twitterLoginBtn.click()
            ]);
            await randSleep(5000, 1000);
            if (popup) {
                let allow = await popup.waitForSelector("#allow");
                if (allow) {
                    allow.click();
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
        await randSleep();
        profile.twitterName = String(await page.$eval('.form-wrapper>input[name="name"]', e => e.textContent));
        await page.type('.form-wrapper>input[name="email"]', profile.email);
        let checkboxes = await page.$$('input[type="checkbox"]');
        await checkboxes[2].click();
        await randSleep();
        await checkboxes[3].click();
        await randSleep();
        await checkboxes[4].click();
        await randSleep();
        await page.click('button[ng-click="setContestant()"]');
        await page.waitForNavigation({ waitUntil: "networkidle0" });
        await randSleep();
        await page.click('a[data-track-event="###APP_NAME### Click|twitter|retweet"]');
        await page.waitForNavigation({ waitUntil: "networkidle0" });
        await randSleep();
        {
            let [popup] = await Promise.all([
                (() => new Promise((resolve) => {
                    page.once("popup", resolve);
                }))(),
                page.click('a[data-track-event="###APP_NAME### Login|instagram"]')
            ]);
            if (popup) {
                let username = await popup.waitForSelector('input[name="username"]');
                let password = await popup.waitForSelector('input[name="password"]');
                if (!username || !password) {
                    return false;
                }
                await username.type(profile.instagram.login);
                await password.type(profile.instagram.password);
                await page.click("button");
                await randSleep();
            }
            else {
                return false;
            }
        }
        {
            let [popup] = await Promise.all([
                (() => new Promise((resolve) => {
                    page.once("popup", resolve);
                }))(),
                page.click('a[data-track-event="###APP_NAME### Login|instagram"]')
            ]);
            await randSleep();
            if (popup) {
                let buttons = await popup.$$("button");
                await buttons[3].click();
                await randSleep();
                popup.close();
            }
            else {
                return false;
            }
        }
        await page.goto(url, { waitUntil: "domcontentloaded" });
    }
    else {
        await solvegiveway(page, profile);
    }
    return profile.twitterName;
    console.log((err ? 'Cannot solve:' : "Solved:"), url);
}
