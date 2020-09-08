/*
    Replaces whitespace in search terms with %20
    so that the search terms can be used in the url
*/

module.exports = {
    create: (input) => {
        let searchTerms = input.split(',');
        for(let i = 0; i < searchTerms.length; ++i) {
            searchTerms[i] = searchTerms[i].replace(/ /g, '%20');
        }
        return searchTerms;
    }
};