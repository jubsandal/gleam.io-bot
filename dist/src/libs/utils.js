export function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
export function randSleep(max = 5000, min = 1000) {
    let ms = Math.round(Math.random() * (max - min) + min);
    return new Promise(resolve => setTimeout(resolve, ms));
}
