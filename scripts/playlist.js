const {execFileSync} = require('child_process');

/*
    Uses ffmpeg to put all the songs scraped from soundcloud 
    into one mp3 file called out.mp3
*/

module.exports = {
    create: () => {
        execFileSync('ffmpeg.exe', ['-f', 'concat', '-i', '.txt', '-c', 'copy', 'out.mp3'], {cwd: `./tracks/`});
    }
};