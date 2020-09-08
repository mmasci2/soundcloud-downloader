const fs = require('fs');
const path = require('path');

/*
    Deletes old songs and empties text files
*/

module.exports = {
    emptyTracks: () => {
        try {
           
            const dir = 'tracks';
            fs.readdir(dir, (e, files) => {
                if(e) throw e;
        
                for(const file of files) {
                    if(file.match(/.mp3$/) || file.match(/.mp4$/) || file.match(/.jpg$/i) || file.match(/.png$/i)) {
                        fs.unlink(path.join(dir, file), e => {
                            if(e) throw e;
                        });
                    }
                }
             });
             
             fs.readdir('text', (e, files) => {
                if(e) throw e;
                for(const file of files){
                    fs.writeFile(`text/${file}`, '', (e) => {
                        if(e) throw e;
                    });
                }
             });

            fs.writeFileSync('tracks/.txt', '');
            console.log('cleanup was a success');
            
        } catch (e) {
            throw e;
        }
    }
}