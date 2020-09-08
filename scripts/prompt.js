const prompt = require('prompt-sync')({sigint: true});
const searchTerms = require('./searchTerms');
const cleanup = require('./cleanup');
const soundCloud = require('./soundCloud');
const description = require('./description');
const playlist = require('./playlist');

/*
    Command line interface to execute functions
*/

async function downloadMusic() {
    console.log('\nComma Seperated. Example (lofi hip hop,lofi chill)');
    const stInput = prompt('Enter Search Terms: ');
    const st = searchTerms.create(stInput);
    let numOfTracks = prompt('Enter Number of Tracks Per Search Term: ');
    numOfTracks = parseInt(numOfTracks);
    cleanup.emptyTracks();
    await soundCloud.scrape(st, stInput, numOfTracks);
}


module.exports = {
    terminal: async () => {
        let loop = true;
        process.stdout.write("\u001b[2J\u001b[0;0H");
        while(loop) {
            console.log(
                '\n1. Download Music' +
                '\n2. Create Description'+
                '\n3. Create Playlist'+
                '\n0. Exit\n'
            );

            const option = prompt('> ');
            switch(option){
                case '1':
                    await downloadMusic();
                    break;
                case '2':
                    await description.create();
                    break;
                case '3':
                    playlist.create();
                    break;
                case '0':
                default:
                    loop = false;
            }
            
        }
        console.log('\nGoodbye\n');
    }
};