import { getMethodName, checkIfAvailable, passVerification, checkForReCapcha, solverReCapcha, } from './libs/helpers.js';
import * as selector from './libs/selector.js';
import * as methods from './libs/methods/methods.js';
import * as facebook from './libs/methods/facebook.js';
import * as instagram from './libs/methods/instagram.js';
import * as youtube from './libs/methods/youtube.js';
import * as custom from './libs/methods/custom.js';
import { randSleep } from './libs/utils.js';
async function solvegiveway(page) {
    await randSleep();
    await passVerification(page);
    for (let i = 0; i < 2; i++) {
        let entryMethods = await page.$$(selector.emVisible);
        console.log("Pass methods count:", entryMethods.length);
        for (const entryMethod of entryMethods) {
            let methodName = await getMethodName(page, entryMethod);
            switch (methodName) {
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
                // case '###APP_NAME### Click|twitter|follow': {
                //     console.log('✔️  ' + methodName);
                //     await twitter.follow(page, entryMethod);
                //     break;
                // }
                // case '###APP_NAME### Click|twitter|tweet': {
                //     console.log('✔️  ' + methodName);
                //     await twitter.tweet(page, entryMethod);
                //     break;
                // }
                // case '###APP_NAME### Click|twitter|retweet': {
                //     console.log('✔️  ' + methodName);
                //     await twitter.tweet(page, entryMethod);
                //     break;
                // }
                // case '###APP_NAME### Click|twitchtv|follow': {
                //     console.log('✔️  ' + methodName);
                //     await twitch.follow(page, entryMethod);
                //     break;
                // }
                case '###APP_NAME### Click|instagram|view_post': {
                    console.log('✔️  ' + methodName);
                    await instagram.view(page, entryMethod);
                    break;
                }
                case '###APP_NAME### Click|facebook|view_post': {
                    console.log('✔️  ' + methodName);
                    await facebook.view(page, entryMethod);
                    break;
                }
                default: {
                    if (methodName.includes('###CUSTOM###')) {
                        await custom.custom(page, entryMethod, methodName);
                    }
                    else {
                        console.log("❌ " + methodName);
                    }
                    break;
                }
            } // switch end
            await randSleep();
        } // for each method end
        await randSleep();
    } // for end 2 passes end
}
export async function grind(browser, url) {
    const page = async () => (await browser.pages())[1];
    await (await page()).goto(url);
    console.log("Going to action:", url);
    await randSleep();
    let err = false;
    if ((await checkIfAvailable(await page())) == false) {
        console.log("Checking for reCapcha");
        if (await checkForReCapcha(await page())) {
            console.log("reCapcha founded");
            if (await solverReCapcha(await page())) {
                console.log("reCapcha solved");
                await solvegiveway(await page());
            }
            else {
                console.log("Cannot solver reCapcha");
            }
        }
        else {
            console.log("Unknown page unavaliability");
        }
    }
    else {
        await solvegiveway(await page());
    }
    console.log((err ? 'Cannot solve:' : "Solved:"), url);
}
