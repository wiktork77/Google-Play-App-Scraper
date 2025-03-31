scraper = require('./scraper_runner.js');

(async () => {
    await scraper.runScraper();
    console.log("Scraping done");
})();