import puppeteer from 'puppeteer'
import * as selector from '../selector.js'
import * as helpers from '../helpers.js'
import * as methods from './methods.js'

import { randSleep } from './../utils.js'

export async function enter(page: puppeteer.Page, entryMethod: puppeteer.ElementHandle<Element>, wallet: string) {
        await entryMethod.click()
        await randSleep()
        let input = await page.$('input[name="data"]')
        if (input) {
                await input.type(wallet)
        }
}
