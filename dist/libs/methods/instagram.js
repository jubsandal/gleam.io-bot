import * as methods from './methods.js';
export async function visit(page, entryMethod) {
    await methods.visit(page, entryMethod);
}
export async function enter(page, entryMethod) {
    await methods.enter(page, entryMethod);
}
export async function view(page, entryMethod) {
    await methods.view(page, entryMethod);
}
