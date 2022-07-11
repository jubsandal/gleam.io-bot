import puppeteer from 'puppeteer'
import * as selector from '../selector.js'
import * as helpers from '../helpers.js'
import * as methods from './methods.js'

export async function visit(page: puppeteer.Page, entryMethod: puppeteer.ElementHandle<Element>) {
    await methods.visit(page, entryMethod)
}

export async function enter(page: puppeteer.Page, entryMethod: puppeteer.ElementHandle<Element>) {
    await methods.enter(page, entryMethod)
}
