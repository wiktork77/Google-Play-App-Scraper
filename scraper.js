const gplay = require('google-play-scraper');
const fmanip = require('./file_manip.js')

function printNumberOfApps(category, list, mode, countryCode) {
    message = "Category: " + category + "\nCountry code: " + countryCode + "\nNumber of apps: " + list.length + "\nSearch mode: " + mode
    console.log(message)
}


async function getAppIdsByCategory(category, mode, countryCode) {
    cat_list = await gplay.list({ category: category, num: 2, collection: mode, country: countryCode});
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
    scrapeToFileCategoryBased
}