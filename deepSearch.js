/*************************************************************************
 * Searches through an object using recursion any time an object is found 
 *************************************************************************/

module.exports = function deepSearch(searchItem, searchPhrase) {
    /*********************************************************************
     * Stringifies the item passed in, and compares it through RegEx
     *********************************************************************/
    function compareValues (searchValue, searchPhrase) {
        const specialValues = {null: 'null', undefined: 'undefined'}; // Non-Object Values that don't have a toString method
        if (specialValues[searchValue ]) searchValue  = specialValues[searchValue ];
        if (specialValues[searchPhrase]) searchPhrase = specialValues[searchPhrase];
        // Preprare Regex
        let search = typeof searchPhrase === 'string' ? searchPhrase : searchPhrase.toString();
        let value  = typeof searchValue  === 'string' ? searchValue  : searchValue.toString() ;
        let searchExp = new RegExp (search, 'i');
        // Test Phrases
        return searchExp.test( value );
    }

    /*********************************************************************
     * 
     *********************************************************************/
    function recursiveSearch (item, accumulator, searchPath = []) {
        if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach( key => { recursiveSearch(item[key], accumulator, searchPath.concat(key)); } );
        } else if (compareValues(item, searchPhrase)) {
            accumulator.push({match: item, path: searchPath});
        }
    }

    var searchMatches = []; // The thing to hold data between recursions
    recursiveSearch(searchItem, searchMatches, []);
    return searchMatches;

};