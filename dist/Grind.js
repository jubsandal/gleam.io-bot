import { getMethodName, passVerification, } from './libs/helpers.js';
import * as selector from './libs/selector.js';
import * as methods from './libs/methods/methods.js';
import * as facebook from './libs/methods/facebook.js';
import * as telegram from './libs/methods/telegram.js';
import * as instagram from './libs/methods/instagram.js';
import * as youtube from './libs/methods/youtube.js';
import * as twitter from './libs/methods/twitter.js';
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
                case "###APP_NAME### Click|telegram|join": {
                    console.log('✔️  ' + methodName);
                    await telegram.join(page, entryMethod);
                    break;
                }
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
                case '###APP_NAME### Click|twitter|retweet': {
                    console.log('✔️  ' + methodName);
                    await twitter.retweet(page, entryMethod);
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
                case '###APP_NAME### Click|instagram|view_post': {
                    console.log('✔️  ' + methodName);
                    await instagram.view(page, entryMethod);
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
    }
}
export async function grind(browser, url, profile) {
    console.log(profile);
    const _pages = await browser.pages();
    let page;
    if (_pages.length < 1) {
    }
    else {
        await _pages[0].close();
    }
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
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
    let err = false;
    await randSleep(5000);
    console.log("waiting captcha");
    try {
        await page.solveRecaptchas();
    }
    catch (e) {
        console.log("Captcha wait timeout", e);
    }
    console.log("logining twitter");
    try {
        try {
            page.evaluate(() => document.querySelector('a[data-track-event="###APP_NAME### Login|twitter"]').click());
            let [popup] = await Promise.all([
                (() => new Promise((resolve) => {
                    page.once("popup", resolve);
                }))(),
            ]);
            await randSleep(5000, 1000);
            if (popup) {
                let allow = await popup.waitForSelector("#allow");
                if (allow) {
                    allow.click();
                }
                else {
                    throw "";
                }
            }
        }
        catch (e) {
            console.log("May be twitter already connected");
        }
        await randSleep(500);
        profile.twitterName = await page.evaluate(() => document.querySelector('.form-wrapper>input[name="name"]').value);
        await page.type('.form-wrapper>input[name="email"]', profile.email);
        let checkboxes = await page.$$('input[type="checkbox"]');
        for (const chbox of checkboxes) {
            try {
                await chbox.click();
                await randSleep(500, 300);
            }
            catch (e) { }
        }
        let sel = await page.waitForSelector('button[ng-click="setContestant()"]', { timeout: 1000 });
        if (sel) {
            await sel.click();
            await randSleep();
        }
    }
    catch (e) {
        console.log("Already logined to twitter or twitter not exists, or banned");
    }
    await randSleep();
    console.log("clicking action...");
    page.evaluate(() => document.querySelector('a[data-track-event="###APP_NAME### Click|twitter|retweet"]').click());
    await randSleep(500, 100);
    try {
        {
            console.log("waiting for instagram popup");
            let popup = await (async () => {
                return new Promise(resolve => {
                    page.once("popup", resolve);
                    page.evaluate(() => document.querySelector('a[data-track-event="###APP_NAME### Login|instagram"]').click());
                });
            })();
            await randSleep(1000);
            if (popup) {
                async function instagramLogin() {
                    let username = await popup.waitForSelector('input[name="username"]', { timeout: 3000 });
                    let password = await popup.waitForSelector('input[name="password"]');
                    if (!username || !password) {
                        throw "";
                    }
                    console.log("typeing instagram auth data");
                    await username?.type(profile.instagram.login);
                    await password?.type(profile.instagram.password);
                    await randSleep();
                    console.log("instagram logining");
                    await popup?.click('button[type="submit"]');
                    await randSleep(1000);
                }
                try {
                    await instagramLogin();
                }
                catch (e) {
                    await popup?.click('a[href="/accounts/login/"]');
                    await instagramLogin();
                }
                finally {
                    await randSleep(5000, 5000);
                    await popup?.close();
                }
            }
            else {
                return false;
            }
        }
    }
    catch (e) { }
    console.log("waiting for next instagram grant permissions popup");
    {
        let popup = await new Promise(async (resolve) => {
            page.once("popup", resolve);
            await randSleep(500, 300);
            page.evaluate(() => document.querySelector('a[data-track-event="###APP_NAME### Login|instagram"]').click());
        });
        await randSleep();
        console.log("accepting");
        if (popup) {
            await popup.evaluate(() => {
                const btns = document.querySelectorAll("button");
                if (btns.length === 2) {
                    btns[1].click();
                }
                else if (btns.length === 4) {
                    btns[3].click();
                }
            });
            await randSleep(11000, 10000);
            if (popup && !popup.isClosed()) {
                await popup?.close();
            }
        }
        else {
            console.log("pop up no appears");
            return false;
        }
    }
    await page?.goto(url, { waitUntil: "domcontentloaded" });
    await randSleep();
    await solvegiveway(page, profile);
    console.log(profile);
    return profile.twitterName;
}
