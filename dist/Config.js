import { array, assert, boolean, object, string } from 'superstruct';
import { readFileSync } from 'fs';
const ConfigSign = object({
    headless: boolean(),
    proxy: array(object({
        host: string(),
        user: string(),
        password: string()
    }))
});
export function Config() {
    let config;
    try {
        config = JSON.parse(readFileSync("./config.json").toString());
    }
    catch (e) {
        throw new Error("config parse error: " + e);
    }
    assert(config, ConfigSign);
    return config;
}
