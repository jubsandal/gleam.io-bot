import puppeteer from 'puppeteer'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import {
	getMethodName,
	checkIfAvailable,
	passVerification,
	checkForReCapcha,
	solverReCapcha,
} from './libs/helpers.js'
import * as selector  from './libs/selector.js'
import * as methods   from './libs/methods/methods.js'
import * as facebook  from './libs/methods/facebook.js'
import * as telegram  from './libs/methods/telegram.js'
import * as instagram from './libs/methods/instagram.js'
import * as youtube   from './libs/methods/youtube.js'
import * as twitter   from './libs/methods/twitter.js'
import * as twitch    from './libs/methods/twitch.js'
import * as custom    from './libs/methods/custom.js'
import * as wallet    from './libs/methods/wallet.js'

import { randSleep } from './libs/utils.js'

async function solvegiveway(page: puppeteer.Page, profile: { twitterName: string, wallet: string, email: string, instagram: { login: string, password: string } }) {
	await randSleep()
	await passVerification(page);

	for (let i = 0; i < 2; i++) {
		let entryMethods = await page.$$(selector.emVisible);
		console.log("Pass methods count:", entryMethods.length);
		for (const entryMethod of entryMethods) {
			let methodName = await getMethodName(page, entryMethod);

			switch (methodName) {
				case "###APP_NAME### Click|telegram|join": {
					console.log('✔️  ' + methodName);
					await telegram.join(page, entryMethod)
					break
				}
				case "###APP_NAME### Click|wallet|address": {
					console.log('✔️  ' + methodName);
					await wallet.enter(page, entryMethod, profile.wallet)
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
				// case '###APP_NAME### Click|twitchtv|follow': {
				// 	console.log('✔️  ' + methodName);
				// 	await twitch.follow(page, entryMethod);
				// 	break;
				// }

				case '###APP_NAME### Click|instagram|view_post': {
					console.log('✔️  ' + methodName);
					await instagram.view(page, entryMethod);
					break;
				}

				// case '###APP_NAME### Click|facebook|view_post': {
				// 	console.log('✔️  ' + methodName);
				// 	await facebook.view(page, entryMethod);
				// 	break;
				// }

				default: {
					if (methodName.includes('###CUSTOM###')) {
						await custom.custom(page, entryMethod, methodName);
					} else {
						console.log("❌ " + methodName);
					}
					break;
				}

			} // switch end
			await randSleep()
		} // for each method end
	} // for end 2 passes end
}

export async function grind(browser: puppeteer.Browser, url: string, profile: { twitterName: string, wallet: string, email: string, instagram: { login: string, password: string } }) {
	console.log(profile)
	const _pages = await browser.pages()
	let page: puppeteer.Page
	if (_pages.length < 1) {
	} else {
		await _pages[0].close()
	}
	page = await browser.newPage()
	await page.setViewport({ width: 1920, height: 1080 })
	await page.setDefaultNavigationTimeout(500000);
	page.on('error', async (err) => {
		const errorMessage = err.toString()
		console.log('browser error: ' + errorMessage)
	});
	page.on('pageerror', async (err: any) => {
		const errorMessage = err.toString()
		console.log('browser this.page error: ' + errorMessage)
	});
	await page.goto(url);
	console.log("Going to action:", url);

	let err = false

	await randSleep(5000)

	console.log("waiting captcha")
	try {
		await page.solveRecaptchas()
	} catch (e) {
	        console.log("Captcha wait timeout", e)
	}
	console.log("logining twitter")

	try {
		try {
			await page.waitForSelector('a[data-track-event="###APP_NAME### Login|twitter"]')
			let [popup] = await Promise.all([
				((): Promise<puppeteer.Page> => new Promise(async (resolve) => {
					page.once("popup", resolve)
					try {
						// @ts-ignore
						await page.evaluate(() => document.querySelector('a[data-track-event="###APP_NAME### Login|twitter"]')!.click())
					} catch (e) {
						// @ts-ignore
						await page.evaluate(() => document.querySelector('a[data-track-event="###APP_NAME### Login|twitter"]')!.click())
					}
				}))(),
			])

			console.log("pop")
			if (popup) {
				console.log("waiting allow")
				let allow = await popup.waitForSelector("#allow", {timeout: 3000})
				if (allow) {
					allow.click()
				} else {
					throw "Cannot click allow"
				}
			} else {
				throw "Cannot find popup"
			}
		} catch (e) {
			console.log("May be twitter already connected", e)
		}


		await randSleep(500)

		console.log("coping name")
		try {
			// @ts-ignore
			profile.twitterName = <string>await page.evaluate(() => document.querySelector('.form-wrapper>input[name="name"]')!.value)
		} catch (e) {
			console.log("Copy name error", e)
		}
		console.log("inputing email")
			try {
				let email_input = await page.$('.form-wrapper>input[name="email"]')
				if (email_input) {
					await email_input.type(profile.email)
				} else {
					throw "Cannot type email"
				}
				console.log("ok")
			} catch (e) {
				console.log(e)
				await randSleep(1000, 500)
				try {
					let email_input = await page.$('.form-wrapper>input[name="email"]')
					if (email_input) {
						await email_input.type(profile.email)
					} else {
						throw "Cannot type email"
					}
					console.log("ok")
				} catch (e) {
					await randSleep(1000, 500)
					let email_input = await page.$('.form-wrapper>input[name="email"]')
					if (email_input) {
						await email_input.type(profile.email)
					} else {
						throw "Cannot type email"
					}
					console.log("ok")
				}
			}

			let checkboxes = await page.$$('input[type="checkbox"]')
			for (const chbox of checkboxes) {
				try {
					await chbox.click()
					await randSleep(500, 300)
				} catch (e) {}
			}

			// if (!checkIfAvailable(page)) {
			// 	throw "asdf"
			// }

			let sel = await page.waitForSelector('button[ng-click="setContestant()"]', {visible: true})
			try {
				if (sel) {
					await sel.click()
					await randSleep()
				} else {
					throw "Cannot sign in with twitter"
				}
			} catch (e) {
				console.log("RESTARTING")
				process.exit()
			}
	} catch (e) {
		console.log("Already logined to twitter or twitter not exists, or banned:", e)
	}

	await randSleep()

	if (!checkIfAvailable(page)) {
		throw " asdf"
	}

	console.log("clicking action...")
	// @ts-ignore
	page.evaluate(() => document.querySelector('a[data-track-event="###APP_NAME### Click|twitter|retweet"]')!.click())
	//await page.click('a[data-track-event="###APP_NAME### Click|twitter|retweet"]')

	await randSleep(1000, 500)

	try {
		{
			console.log("waiting for instagram popup")
			await page.waitForSelector('a[data-track-event="###APP_NAME### Login|instagram"]', {visible:true, timeout: 2000})
			let popup = await (async (): Promise<puppeteer.Page> => {
				return new Promise(resolve => {
					page.once("popup", resolve)
					// @ts-ignore
					page.evaluate(() => document.querySelector('a[data-track-event="###APP_NAME### Login|instagram"]')!.click())
				})
			})()

			await randSleep(1000)

			if (popup) {
				async function instagramLogin() {
					let username = await popup.waitForSelector('input[name="username"]', {timeout: 3000})
					let password = await popup.waitForSelector('input[name="password"]')

					if (!username || !password) {
						throw ""
					}

					console.log("typeing instagram auth data")


					await username?.type(profile.instagram.login)
					await password?.type(profile.instagram.password)

					await randSleep()

					console.log("instagram logining")

					await popup?.click('button[type="submit"]')
					await randSleep(1000)
				}

				try {
					await instagramLogin()
				} catch (e) {
					await popup?.click('a[href="/accounts/login/"]')
					await instagramLogin()
				} finally {
					await randSleep(5000, 5000)
					await popup?.close()
				}
			} else {
				return false
			}
		}
	} catch (e) {}

	await page.waitForSelector('a[data-track-event="###APP_NAME### Login|instagram"]', {visible:true, timeout: 2000})
	console.log("waiting for next instagram grant permissions popup")
	{
		// @ts-ignore
		let popup = await new Promise(async (resolve): Promise<puppeteer.Page> => {
			page.once("popup", resolve)
			await randSleep(500, 300)
			// @ts-ignore
			page.evaluate(() => document.querySelector('a[data-track-event="###APP_NAME### Login|instagram"]')!.click())
		})

		await randSleep()

		console.log("accepting")
		if (popup) {
			// @ts-ignore
			await popup.evaluate(() => {
				const btns = document.querySelectorAll("button")
				// use compact b.len-1 assign
				if (btns.length === 2) {
					// @ts-ignore
					btns[1]!.click()
				} else if (btns.length === 4) {
					// @ts-ignore
					btns[3]!.click()
				}
			})
			await randSleep(5000, 3000)
			// @ts-ignore
			if (popup && !popup.isClosed()) {
				// @ts-ignore
				await popup?.close()
			}
		} else {
			console.log("pop up no appears")
			return false
		}
	}

	await page?.goto(url, { waitUntil: "domcontentloaded" })

	await randSleep()

	// seconds chance
	try {
		await solvegiveway(page, profile)
	} catch (e) {
		try {
			await solvegiveway(page, profile)
		} catch (e) {}
	}
	return profile.twitterName
}
