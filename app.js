scraper = require('./scraper.js');

(async () => {
    var computeRatio = false
    var args = process.argv.slice(2);
    if (args.length > 0) {
        computeRatio = args[0] == "ratio";
    }
    await scraper.runScraper(computeRatio);
    console.log("Scraping done");
})();