import * as selector from '../selector.js';
import { randSleep } from './../utils.js';
export async function enter(page, entryMethod, wallet) {
    await entryMethod.click();
    await randSleep();
    let input = await page.$('input[name="data"]');
    if (input) {
        await input.type(wallet);
    }
    await page.click(selector.em_continueEnabledButton);
}
