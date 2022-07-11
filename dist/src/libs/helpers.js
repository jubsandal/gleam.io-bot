import * as selector from './selector.js';
import { sleep } from './utils.js';
export async function getMethodName(page, entryMethod) {
    let methodName = await page.evaluate(el => el.getAttribute("data-track-event"), entryMethod);
    if (methodName == '###APP_NAME### Click|custom|action') {
        methodName = await page.evaluate(el => el.innerHTML, await entryMethod.$("span[class*='entry-method-title']"));
        methodName = '###CUSTOM### ' + methodName.trim();
    }
    return methodName;
}
export async function checkIfAvailable(page) {
    const triangle = await page.$(selector.gleam_triangle);
    const globe = await page.$(selector.gleam_globe);
    const content = await page.$(selector.emContent);
    if (triangle == null && globe == null && content != null) {
        console.log("Giveway avalible");
        return true;
    }
    else {
        console.log("Giveway not avalible");
        return false;
    }
}
export async function checkForReCapcha(page) {
    page.title();
    await sleep(10000);
    return true;
}
export async function solverReCapcha(page) {
    page.title();
    await sleep(1000);
    return true;
}
export async function passVerification(page) {
    let verification = false;
    try {
        await page.waitForSelector(selector.vf, {
            timeout: 500,
        });
        verification = true;
        const inGameNameField = await page.$(selector.vf_inGameName);
        if (inGameNameField != null) {
            await inGameNameField.type("Julien");
        }
        const stateSelect = await page.$(selector.vf_state);
        if (stateSelect != null) {
            await stateSelect.select("Other");
        }
        const stateOtherField = await page.$(selector.vf_stateOther);
        if (stateOtherField != null) {
            await stateOtherField.type("In home");
        }
        const countrySelect = await page.$(selector.vf_country);
        if (countrySelect != null) {
            await countrySelect.select("Russia");
        }
        const companyField = await page.$(selector.vf_company);
        if (companyField != null) {
            await companyField.type("Exeed Team");
        }
        const birthDateMDYField = await page.$(selector.vf_birthDateMDY);
        if (birthDateMDYField != null) {
            await birthDateMDYField.type("01201990");
        }
        const birthDateDMYField = await page.$(selector.vf_birthDateDMY);
        if (birthDateDMYField != null) {
            await birthDateDMYField.type("20011990");
        }
        const phoneField = await page.$(selector.vf_phone);
        if (phoneField != null) {
            await phoneField.type("9097540074");
        }
        const zipField = await page.$(selector.vf_zip);
        if (zipField != null) {
            await zipField.type("27230");
        }
        const checkbox1 = await page.$(selector.vf_checkbox);
        if (checkbox1 != null) {
            await checkbox1.click();
        }
        const checkbox2 = await page.$(selector.vf_checkbox);
        if (checkbox2 != null) {
            await checkbox2.click();
        }
        const ageField = await page.$(selector.vf_age);
        if (ageField != null) {
            await ageField.type('25');
        }
        const maleRadio = await page.$(selector.vf_male);
        if (maleRadio != null) {
            await maleRadio.click();
        }
        const saveButton = await page.waitForSelector(selector.em_continueEnabledButton, {
            timeout: 2000
        });
        await saveButton?.click();
    }
    catch (error) { }
    try {
        const textArea = await page.waitForSelector(selector.emExpanded + " textarea", {
            timeout: 500,
        });
        verification = true;
        textArea?.type("Yes");
    }
    catch (error) { }
    if (verification) {
        console.log('Verification passed');
    }
    return verification;
}
