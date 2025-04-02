const fmanip = require('./file_manip.js')
const gplay = require('google-play-scraper');

async function getAppGenre(appId) {
    info = await gplay.app({appId:appId})
    return info.genreId
}

async function getAppFreeStatus(appId) {
    try {
        info = await gplay.app({appId:appId})
        if (info.free) {
            return "free"
        } else {
            return "paid"
        }
    } catch(e) {
        return "undefined"
    }
}

async function getFreeAndPaidAppsCount(path) {
    status_dict = {
        'free': 0,
        'paid': 0,
        'undefined': 0,
    }
    temp = await fmanip.fileToSet(path)
    console.log("Checking isPaid status of the Apps (filling categories_ratio):");
    id_arr = Array.from(temp)
    arr_len = id_arr.length;
    for (let i = 0; i < id_arr.length; i++) {
        fmanip.overwriteLog(`${i}/${id_arr.length}`)
        stat = await getAppFreeStatus(id_arr[i])
        status_dict[stat] += 1
    }

    return status_dict
}


async function produceGenreIdSet(path) {
    set = new Set()
    temp = await fmanip.fileToSet(path)
    ids_arr = Array.from(temp)
    for (let i = 0; i < ids_arr.length; i++) {
        try {
            genre = await getAppGenre(ids_arr[i])
            set.add(genre)
        } catch (e) {
            console.log(e)
            console.log("APP ID THAT CAUSES PROBLEM: (LINE " + (i+1) + "): " + ids_arr[i])
        }
    }
    return set
}



async function checkIfIdIsBad(id) {
    info = await gplay.app({appId: id})
    return info
}

module.exports = {
    produceGenreIdSet,
    checkIfIdIsBad,
    getAppFreeStatus,
    getFreeAndPaidAppsCount
}