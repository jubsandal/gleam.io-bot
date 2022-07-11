import puppeteer from 'puppeteer'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import pupExtra from 'puppeteer-extra'
import * as gleam from './GleamList.js'
import axios from 'axios'
// @ts-ignore
import { proxyRequest } from 'puppeteer-proxy'
import { loader } from './loader.js'
import { sleep } from './libs/utils.js'
import * as fs from 'fs'
import { grind } from './Grind.js'

import { Config } from './Config.js'

pupExtra.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: "de0f9fae2e7c113c4e1a5a9250c086ac"
        },
        visualFeedback: false
    })
)

async function setupBrowser(adsSerialNumber: number) {
        // let pupOpts = () => {
        //         return {
        //                 headless: Config().headless,
        //                 args: [
        //                         '--no-sandbox',
        //                         '--disable-setuid-sandbox',
        //                         '--disable-dev-shm-usage',
        //                 ]
        //         }
        // }
        // adsSerialNumber
        // let browser = await puppeteer.launch(pupOpts());
        // await setupPage(browser)
        // return browser

        let browser: puppeteer.Browser
        let res
        try {
                res = await axios.get('http://' + "localhost" + ':50325/api/v1/browser/start?serial_number=' + adsSerialNumber)
        } catch (e) {
                throw "Cannot connect to AdsPower Local API " + e
        }
        try {
                let puppeteerWs = <string>res.data.data.ws.puppeteer
                browser = await pupExtra.connect({
                        browserWSEndpoint: puppeteerWs
                })
        } catch (e) {
                throw "Cannot connect to AdsPower browser with serial number: " + adsSerialNumber + " " + (typeof e === "object" ? JSON.stringify(e, null, '\t') : e)
        }
        await sleep(1000)
        return browser
}

Config()

let profiles: { ads: number, twitterName: string, wallet: string, email: string, instagram: { login: string, password: string } }[] = loader()

const link = "https://wn.nr/L82wwm"

let updatedProfiles = new Array()

for (let profile of profiles) {
	const start = new Date().getTime()
	console.log("-".repeat(20))
	console.log("Account:", profile.ads)
	console.log("-".repeat(20))
	let browser
	try {
		browser = await setupBrowser(profile.ads)
		let twitterName = await Promise.race([
			await grind(browser, link, profile),
			new Promise((_, reject) => { setTimeout(() => reject("timeout"), 180000) })
		])
		if (twitterName === false || twitterName === "timeout" || !twitterName) {
			console.log("Error on ads", profile.ads)
		} else if (typeof twitterName === "string") {
			profile.twitterName = twitterName
			updatedProfiles.push(profile)
			fs.writeFileSync("./updatedProfiles", JSON.stringify(updatedProfiles))
		}
	} catch (error) {
		console.log("Fatal error on ads", profile.ads, error)
	} finally {
		if (browser) {
			await browser.close()
		}
		console.log("-".repeat(20))
		console.log("elapced:", (new Date().getTime()-start)+'ms')
		console.log("-".repeat(20))
	}
}
