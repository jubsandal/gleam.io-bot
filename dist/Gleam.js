import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import pupExtra from 'puppeteer-extra';
import axios from 'axios';
import { loader } from './loader.js';
import { sleep } from './libs/utils.js';
import * as fs from 'fs';
import { grind } from './Grind.js';
import { Config } from './Config.js';
pupExtra.use(RecaptchaPlugin({
    provider: {
        id: '2captcha',
        token: "de0f9fae2e7c113c4e1a5a9250c086ac"
    },
    visualFeedback: false
}));
async function setupBrowser(adsSerialNumber) {
    let browser;
    let res;
    try {
        res = await axios.get('http://' + "localhost" + ':50325/api/v1/browser/start?serial_number=' + adsSerialNumber);
    }
    catch (e) {
        throw "Cannot connect to AdsPower Local API " + e;
    }
    try {
        let puppeteerWs = res.data.data.ws.puppeteer;
        browser = await pupExtra.connect({
            browserWSEndpoint: puppeteerWs
        });
    }
    catch (e) {
        throw "Cannot connect to AdsPower browser with serial number: " + adsSerialNumber + " " + (typeof e === "object" ? JSON.stringify(e, null, '\t') : e);
    }
    await sleep(1000);
    return browser;
}
Config();
let updatedProfiles = JSON.parse(fs.readFileSync("./updatedProfiles").toString());
let profiles = loader();
profiles = profiles.filter(p => !updatedProfiles.map((a) => a.ads).includes(p.ads));
const link = "https://wn.nr/L82wwm";
for (let profile of profiles) {
    console.log(new Date().toString());
    const start = new Date().getTime();
    console.log("-".repeat(20));
    console.log("Account:", profile.ads);
    console.log("-".repeat(20));
    let err = false;
    let browser;
    try {
        browser = await setupBrowser(profile.ads);
        let twitterName = await Promise.race([
            await grind(browser, link, profile),
            new Promise((_, reject) => { setTimeout(() => reject("timeout"), 120000); })
        ]);
        if (twitterName === false || twitterName === "timeout" || !twitterName) {
            console.log("Error on ads", profile.ads);
            err = true;
        }
        else if (typeof twitterName === "string") {
            err = false;
            profile.twitterName = twitterName;
        }
    }
    catch (error) {
        console.log("Fatal error on ads", profile.ads, error);
        err = true;
    }
    finally {
        updatedProfiles.push(profile);
        fs.writeFileSync("./updatedProfiles", JSON.stringify(updatedProfiles.map((e) => { return { ...e, err: err }; })));
        if (browser) {
            await browser.close();
        }
        console.log("-".repeat(20));
        console.log("elapced:", (new Date().getTime() - start) + 'ms');
        console.log("-".repeat(20));
    }
}
