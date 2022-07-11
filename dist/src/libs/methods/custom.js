import * as methods from './methods.js';
export async function custom(page, entryMethod, methodName) {
    if (methodName.includes('Visit') || methodName.includes('visit')) {
        console.log('✔️  ' + methodName);
        methods.visit(page, entryMethod);
    }
    else if (methodName.includes('Daily Bonus Entry')) {
        console.log('✔️  ' + methodName);
        methods.enter(page, entryMethod);
    }
    else {
        console.log('❌  ' + methodName);
    }
}
