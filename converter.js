const fmanip = require('./file_manip.js')
const gplay = require('google-play-scraper');
const catProb = {
    'ART_AND_DESIGN':	0.0353448275862069,
    'AUTO_AND_VEHICLES':	0.02586337473492881,
    'BEAUTY':	0.0045901639344262295,
    'BOOKS_AND_REFERENCE':	0.05485582707905922,
    'BUSINESS':	0.0096995376573836,
    'COMICS':	0.0693503387803906,
    'COMMUNICATION':	0.01940739120927181,
    'DATING':	0.008686983765309029,
    'EDUCATION':	0.04780101257940891,
    'ENTERTAINMENT':	0.02839347176092245,
    'EVENTS':	0.003461458979127919,
    'FINANCE':	0.018139580862000793,
    'FOOD_AND_DRINK':	0.005544244892023559,
    'HEALTH_AND_FITNESS':	0.025556030795551753,
    'HOUSE_AND_HOME':	0.010928061504667765,
    'LIBRARIES_AND_DEMO':	0.022112152839200424,
    'LIFESTYLE':	0.021236064867730126,
    'MAPS_AND_NAVIGATION':	0.04541642474679053,
    'MEDICAL':	0.05657258462449423,
    'MUSIC_AND_AUDIO':	0.01942221153515853,
    'NEWS_AND_MAGAZINES':	0.005103969754253308,
    'PARENTING':	0.042384630619924736,
    'PERSONALIZATION':	0.1813751240296504,
    'PHOTOGRAPHY':	0.030491883018179608,
    'PRODUCTIVITY':	0.03530051234561688,
    'SHOPPING':	0.002593801286525438,
    'SOCIAL':	0.00970419995993679,
    'SPORTS':	0.049205742439687394,
    'TOOLS':	0.04964165261382799,
    'TRAVEL_AND_LOCAL':	0.035049563544903094,
    'WEATHER':	0.05394066526820498
}

function bToInt(val) {
    if (val) {
        return 1
    } else {
        return 0
    }
}

async function extractDataFromApp(appId) {
    try {
        const result = await gplay.app({
            appId: appId
        })
        const extractedData = {
            installs: result.minInstalls,
            score: result.score,
            ratings: result.ratings,
            reviews: result.reviews,
            catProb: catProb[result.genreId],
            isFree: bToInt(result.free),
        }
        return extractedData
    } catch {
        return null
    }
}

function inform(count) {
    if (count % 250 == 0) {
        console.log(`${count} lines parsed`)
    }
}


async function convertIdsToData(destination) {
    const idsPath = "D:\\Programowanie\\NodeJS\\Scraper\\app_ids\\all_ids.txt"
    fileContent = await fmanip.fileToSet(idsPath)
    console.log("converting to set is done!")
    let parsedCount = 0
    for (const appId of fileContent) {
        res = await extractDataFromApp(appId)
        if (res != null) {
            let row = `${res.installs},${res.score},${res.ratings},${res.reviews},${res.catProb},${res.isFree}`
            fmanip.appendToFile(row, destination)
        }
        parsedCount += 1
        inform(parsedCount)
    }
}


module.exports = {
    convertIdsToData,
}