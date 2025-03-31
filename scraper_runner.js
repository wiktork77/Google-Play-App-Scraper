const category = require('google-play-scraper').category;
const collection = require('google-play-scraper').collection;
const fmanip = require('./file_manip.js')
const scraper = require('./scraper.js')
const checker = require('./checker.js')
const converter = require('./converter.js')
const countries = ['ad'];
// const countries = ['ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bl', 'bm', 'bn', 'bo', 'bq', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mf', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'um', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm', 'zw']
const catNames = ['ART_AND_DESIGN', 'AUTO_AND_VEHICLES', 'BEAUTY', 'BOOKS_AND_REFERENCE', 'BUSINESS', 'COMICS', 'COMMUNICATION', 'DATING', 'EDUCATION', 'ENTERTAINMENT', 'EVENTS', 'FINANCE', 'FOOD_AND_DRINK', 'HEALTH_AND_FITNESS', 'HOUSE_AND_HOME', 'LIBRARIES_AND_DEMO', 'LIFESTYLE', 'MAPS_AND_NAVIGATION', 'MEDICAL', 'MUSIC_AND_AUDIO', 'NEWS_AND_MAGAZINES', 'PARENTING', 'PERSONALIZATION', 'PHOTOGRAPHY', 'PRODUCTIVITY', 'SHOPPING', 'SOCIAL', 'SPORTS', 'TOOLS', 'TRAVEL_AND_LOCAL', 'WEATHER']


function produceRatioContent(ratio) {
    output = ""
    for (const [key, value] of Object.entries(ratio)) {
        output += `${key}: ${value}\n`
    }
    return output
}

function produceAppIdPath(name) {
    return "./app_ids/" + name + ".txt"
}

function produceRatioPath(path) {
    fname = fmanip.getFileName(path)
    return "./categories_ratio/" + fname + "_RATIO.txt"
}

async function run(fpath, countryCode, cat) {
    amount = 0 
    amount += await scraper.scrapeToFileCategoryBased(fpath, cat, collection.TOP_FREE, countryCode)
    amount += await scraper.scrapeToFileCategoryBased(fpath, cat, collection.TOP_PAID, countryCode)
    amount += await scraper.scrapeToFileCategoryBased(fpath, cat, collection.GROSSING, countryCode)
    return amount
}


async function fillRatioFile(path) {
    ratio = await checker.getFreeAndPaidAppsCount(path)
    console.log("cp1");
    ratio_path = produceRatioPath(path)
    console.log("cp2");
    ratio_content = produceRatioContent(ratio)
    console.log("cp3");
    fmanip.appendToFile(ratio_content, ratio_path)
    console.log("cp4");
}


async function runForAllCountries(path, cat) {
    amount = 0
    for(let i = 0; i < countries.length; i++) {
        try {
            amount += await run(path, countries[i], cat)
        } catch (e) {
            continue
        }
    }
    await fillRatioFile(path)
}

async function runForEverything() {
    for (let k = 0; k < catNames.length; k++) {
        console.log("current category: " + catNames[k]);
        let current_path = produceAppIdPath(catNames[k])
        await runForAllCountries(current_path, catNames[k])
    }
}

function runScraper() {
    runForEverything()    
    const destinationPath = "./Data/apps_data.csv"
    // convert(destinationPath)
}


async function convert(destination) {
    result = await converter.convertIdsToData(destination)
}


module.exports = {
    runScraper,
}

