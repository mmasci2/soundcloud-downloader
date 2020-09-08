const fs = require('fs');
const mp3Duration = require('mp3-duration');
const shuffle = require('./shuffle');

/*
    Creates timestamps for each song and writes it into
    description.txt
*/


function timestamp(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().substr(11, 8);
    return timeString;
} 

module.exports = {
    create: async () => {
        
        let descText = 'CREDITS\n\n';
        let ffmpegText = '';
        const creditsText = fs.readFileSync('text/credits.txt', {encoding: 'utf-8'}).split('\n');
    
        let length = '00:00:00';
        let time = 0;
        
        const filenames = fs.readdirSync('tracks');
        let tracks = [];
        filenames.forEach(file => {
            if(file.match(/.mp3$/)){
                tracks.push(file);
            }
        });
        
        tracks = shuffle.playlist(tracks);
        
        for(let i = 0; i < tracks.length; ++i){

            let song = '';
            let artist = '';
            const n = creditsText.findIndex(a => a.includes(`${tracks[i]}`));
            
            if(n > -1){
                song = creditsText[n].split(' ').pop();
                artist = song.slice(0, song.lastIndexOf('/'));
            }
            descText += `${length} ${song} - ${artist}\n\n`;
            ffmpegText += `file '${tracks[i]}'\n`;
            
            time += await mp3Duration(`tracks/${tracks[i]}`, function(e, duration){
                if(e) throw e;
                return duration;
            });
            length = timestamp(time);
        }

        fs.writeFileSync('text/description.txt', descText);
        console.log('description.txt has been written');
        fs.writeFileSync('tracks/.txt', ffmpegText);
        console.log('.txt has been written');
        
    }
};