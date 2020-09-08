const puppeteer = require('puppeteer');
const scdl = require('soundcloud-downloader');
const fs = require('fs');
const shuffle = require('./shuffle');

/* 
    Scrapes songs from soundcloud using puppeteer and then shuffles them
*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    scrape: async (searchTerms, searchTermsWithSpaces, numOfTracks) => {
        try {

            let tracks = [];

            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            
            for(let i = 0; i < searchTerms.length; ++i){
                
                const url = `https://soundcloud.com/search/sounds?q=${searchTerms[i]}&filter.license=to_use_commercially&filter.duration=medium`;
                await page.goto(url, { waitUntil: 'networkidle2'});

                let links = await page.evaluate(() => {
                    return Array.from(document
                        .querySelectorAll('li[class="searchList__item"] a[class="soundTitle__title sc-link-dark"]'))
                        .map(el => el.href);
                });
                
                if(links.length > numOfTracks){
                    links = shuffle.playlist(links);
                    links.splice(numOfTracks, links.length - numOfTracks);
                }

                tracks.push(...links);
                await sleep(3000);
            }

        
            await browser.close();
            
            tracks = [...new Set(tracks)]
            
            const CLIENT_ID = 'kDTgNffLtm2eZezhAknp3lr4KMWZPyti';

            let creditText = '';
            for(let i = 0; i < tracks.length; ++i) {
                await scdl.download(tracks[i], CLIENT_ID)
                .then(stream => stream.pipe(fs.createWriteStream(`tracks/${i}.mp3`)))
                .then(console.log(`Success: ${tracks[i]} has been downloaded`));
                
                creditText += `${i}.mp3 ${tracks[i]}\n`;
                await sleep(3000);
            };

            fs.writeFileSync('text/credits.txt', creditText);
            console.log('credits.txt has been written');
            fs.writeFileSync('text/tags.txt', searchTermsWithSpaces);
            console.log('tags.txt has been written');
        } catch (e) {
            throw e;
        }
    }

}