const gplay = require('google-play-scraper');
const category = require('google-play-scraper').category;
const collection = require('google-play-scraper').collection;
const fmanip = require('./utility_tools/file_manip.js')
const checker = require('./utility_tools/checker.js')
const converter = require('./converter.js')
// const countries = ['ad', 'ae']; for testing
const countries = ['ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bl', 'bm', 'bn', 'bo', 'bq', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mf', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'um', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm', 'zw']
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
    amount += await scrapeToFileCategoryBased(fpath, cat, collection.TOP_FREE, countryCode)
    amount += await scrapeToFileCategoryBased(fpath, cat, collection.TOP_PAID, countryCode)
    amount += await scrapeToFileCategoryBased(fpath, cat, collection.GROSSING, countryCode)
    return amount
}


async function fillRatioFile(path) {
    ratio = await checker.getFreeAndPaidAppsCount(path)
    ratio_path = produceRatioPath(path)
    ratio_content = produceRatioContent(ratio)
    if (fmanip.fileExists(ratio_path)) {
        fmanip.overwriteFile(ratio_path, "")
    }
    fmanip.appendToFile(ratio_content, ratio_path)
}


async function runForAllCountries(path, cat, computeRatio) {
    amount = 0
    for(let i = 0; i < countries.length; i++) {
        try {
            amount += await run(path, countries[i], cat)
        } catch (e) {
            // console.log(e); uncomment for debugging
            continue
        }
    }
    if (computeRatio) {
        await fillRatioFile(path)
    }
}

async function runForEverything(computeRatio) {
    paths = [];
    for (let k = 0; k < catNames.length; k++) {
        console.log("current category: " + catNames[k]);
        let current_path = produceAppIdPath(catNames[k]);
        paths.push(current_path);
        
        await runForAllCountries(current_path, catNames[k], computeRatio)
    }
    console.log("merging");
    fmanip.mergeFiles(paths, './app_ids/all_ids.txt');
}

async function runScraper(computeRatio) {
    await runForEverything(computeRatio)
    const destinationPath = "./Data/apps_data.csv"
    await convert(destinationPath)
}


async function convert(destination) {
    console.log("Scraping app ids done!")
    console.log("");
    console.log("Converting app ids to app data...")
    result = await converter.convertIdsToData(destination)
}

function printNumberOfApps(category, list, mode, countryCode) {
    message = "Category: " + category + "\nCountry code: " + countryCode + "\nNumber of apps: " + list.length + "\nSearch mode: " + mode
    console.log(message)
}


async function getAppIdsByCategory(category, mode, countryCode) {
    cat_list = await gplay.list({ category: category, num: 1000, collection: mode, country: countryCode});
    printNumberOfApps(category, cat_list, mode, countryCode)
    app_ids = new Set()
    for (i = 0; i < cat_list.length; i++) {
        app_ids.add(cat_list[i].appId)
    }
    return app_ids
}


async function scrapeToFileCategoryBased(path, category, mode, countryCode) {
    ids = await getAppIdsByCategory(category, mode, countryCode)
    ids_l = Array.from(ids)
    amount = await fmanip.appendsIdsToFile(ids_l, path)
    console.log(amount + " lines added.")
    console.log("");
    return amount
}


module.exports = {
    runScraper,
}

