import puppeteer from 'puppeteer'
import * as selector from '../selector.js'
import * as helpers from '../helpers.js'
import * as methods from './methods.js'

import { sleep } from './../utils.js'

export async function join(page: puppeteer.Page, entryMethod: puppeteer.ElementHandle<Element>) {
	if ((await page.$(selector.emExpanded)) == null) {
		await entryMethod.click();
	}
	try {
		await sleep(1000)

		// @ts-ignore
		await page.waitForSelector(selector.em_continueEnabledButton);
		await page.click(selector.em_continueEnabledButton);

		await page.waitForSelector(selector.emExpanded, {
			hidden: true
		});
		await page.waitForSelector(selector.em_fa_check);
	} catch (error) {}
}
