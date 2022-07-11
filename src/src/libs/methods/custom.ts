import puppeteer from 'puppeteer'
import * as selector from '../selector.js'
import * as helpers from '../helpers.js'
import * as methods from './methods.js'

export async function custom(page: puppeteer.Page, entryMethod: puppeteer.ElementHandle<Element>, methodName: string) {
    if (methodName.includes('Visit') || methodName.includes('visit')) {
        console.log('✔️  ' + methodName);
        methods.visit(page, entryMethod);
    } else if (methodName.includes('Daily Bonus Entry')) {
        console.log('✔️  ' + methodName);
        methods.enter(page, entryMethod);
    } else {
        console.log('❌  ' + methodName);
    }
}
