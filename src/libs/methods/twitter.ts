import puppeteer from 'puppeteer'
import * as selector from '../selector.js'
import * as helpers from '../helpers.js'
import * as methods from './methods.js'

import { sleep } from './../utils.js'

export async function follow(page: puppeteer.Page, entryMethod: puppeteer.ElementHandle<Element>) {
	if ((await page.$(selector.emExpanded)) == null) {
		await entryMethod.click();
	}
	helpers.passVerification(page);
	try {
		await page.waitForSelector(selector.em_twitterButton, {
			timeout: 3000
		})

		let [popup] = await Promise.all([
			new Promise(( resolve ) => page.once('popup', resolve)),
				await page.click(selector.em_twitterButton)
		]);

		await sleep(2000)

		// @ts-ignore
		await popup.waitFor('body');
		// @ts-ignore
		await popup.waitFor(500);
		// @ts-ignore
		await popup.waitForSelector('div[role="button"]');

		// @ts-ignore
		let text = await popup.evaluate("document.querySelector('div[role=\"button\"]').innerText");
		if (text != 'Following') {
			// @ts-ignore
			await popup.click('div[role="button"]');
		}

		await sleep(1000)

		// @ts-ignore
		await popup.close();
		await page.waitForSelector(selector.em_continueEnabledButton);
		await page.click(selector.em_continueEnabledButton);

		await page.waitForSelector(selector.emExpanded, {
			hidden: true
		});
		await page.waitForSelector(selector.em_fa_check);
	} catch (error) {}
}

export async function retweet(page: puppeteer.Page, entryMethod: puppeteer.ElementHandle<Element>) {
	if ((await page.$(selector.emExpanded)) == null) {
		await entryMethod.click();
	}
	helpers.passVerification(page);
	try {
		await page.waitForSelector(selector.em_twitterButton, {
			timeout: 3000
		})

		let [popup] = await Promise.all([
			new Promise(( resolve ) => page.once('popup', resolve)),
				await page.click(selector.em_twitterButton)
		]);

		await sleep(2000)

		// @ts-ignore
		await popup.waitFor('body');
		// @ts-ignore
		await popup.waitFor(500);
		// @ts-ignore
		await popup.waitForSelector('div[role="button"]');

		// @ts-ignore
		await popup.click('div[role="button"]');

		await sleep(1000)

		// @ts-ignore
		await popup.close();
		await page.waitForSelector(selector.em_continueEnabledButton);
		await page.click(selector.em_continueEnabledButton);

		await page.waitForSelector(selector.emExpanded, {
			hidden: true
		});
		await page.waitForSelector(selector.em_fa_check);
	} catch (error) {}
}

export async function tweet(page: puppeteer.Page, entryMethod: puppeteer.ElementHandle<Element>) {
	if ((await page.$(selector.emExpanded)) == null) {
		await entryMethod.click();
	}
	helpers.passVerification(page);

	try {
		await page.waitForSelector(selector.em_twitterButton, {
			timeout: 3000
		})

		let [popup] = await Promise.all([
			new Promise(resolve => page.once('popup', resolve)),
				await page.click(selector.em_twitterButton)
		]);

		// @ts-ignore
		await popup.waitFor('body');
		// @ts-ignore
		await popup.waitFor(500);
		// @ts-ignore
		await popup.waitForSelector("input[class*=submit]:not([disabled])");
		// @ts-ignore
		await popup.click("input[class*=submit]:not([disabled])");
		await page.waitForSelector(selector.em_continueEnabledButton);
		await page.click(selector.em_continueEnabledButton);

		await page.waitForSelector(selector.emExpanded, {
			hidden: true
		});
		await page.waitForSelector(selector.em_fa_check);
	} catch (error) {}
}
