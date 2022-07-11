import puppeteer from 'puppeteer';
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
        browser = await puppeteer.connect({
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
let profiles = loader();
console.log(profiles);
const link = "https://wn.nr/L82wwm";
let updatedProfiles = new Array();
for (let profile of profiles) {
    let browser = await setupBrowser(profile.ads);
    try {
        let twitterName = await grind(browser, link, profile);
        if (twitterName === false) {
            console.log("Error on ads", profile.ads);
        }
        else {
            profile.twitterName = twitterName;
            updatedProfiles.push(profile);
            fs.writeFileSync("./updatedProfiles", JSON.stringify(updatedProfiles));
        }
    }
    catch (error) {
        console.log("Fatal error on ads", profile.ads, error);
    }
    await browser.close();
}
