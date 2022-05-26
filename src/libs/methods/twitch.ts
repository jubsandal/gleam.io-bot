import puppeteer from 'puppeteer'
import * as selector from '../selector.js'
import * as helpers from '../helpers.js'
import * as methods from './methods.js'

export async function follow(page: puppeteer.Page, entryMethod: puppeteer.ElementHandle<Element>) {
    await methods.enter(page, entryMethod)
}
