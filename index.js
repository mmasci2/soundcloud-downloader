const prompt = require('./scripts/prompt');

function main() {

    try {

        prompt.terminal();

    } catch (e) {
        console.log(e.message);
    }

}

main();
