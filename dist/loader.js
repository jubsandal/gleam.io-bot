import * as fs from 'fs';
export function loader() {
    let raw = fs.readFileSync('./profiles').toString().split("\n");
    let ret = new Array();
    for (const line of raw) {
        let splited = line.split(" ");
        if (splited.length === 1 || splited.length === 0) {
            continue;
        }
        ret.push({
            ads: Number(splited[0]),
            twitterName: "",
            email: splited[1].split(":")[0],
            instagram: {
                login: splited[2].split(":")[0],
                password: splited[2].split(":")[1]
            },
            wallet: splited[3]
        });
    }
    return ret;
}
