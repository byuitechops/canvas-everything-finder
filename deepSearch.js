/*************************************************************************
 * Searches through an object using recursion any time an object is found 
 *************************************************************************/

module.exports = function deepSearch(searchItem, searchPhrase) {
    /*********************************************************************
     * Stringifies the item passed in, and compares it through RegEx
     *********************************************************************/
    function compareValuesString (searchValue, searchPhrase) {
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
     * Stringifies the item passed in, and compares it through RegEx
     *********************************************************************/
    function compareValuesFunction (searchValue, searchPhrase) {
        return searchPhrase(searchValue);
    }

    /*********************************************************************
     * 
     *********************************************************************/
    function recursiveSearchString (item, accumulator, searchPath = []) {
        if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach( key => { recursiveSearchString(item[key], accumulator, searchPath.concat(key)); } );
        } else if (compareValuesString(item, searchPhrase)) {
            accumulator.push({match: item, path: searchPath});
        }
    }

    /*********************************************************************
     * 
     *********************************************************************/
    function recursiveSearchFunction (item, accumulator, searchPath = []) {
        if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach( key => { recursiveSearchFunction(item[key], accumulator, searchPath.concat(key)); } );
        } else if (compareValuesFunction(item, searchPhrase)) {
            accumulator.push({match: item, path: searchPath});
        }
    }

    var searchMatches = []; // The thing to hold data between recursions
    if (typeof searchPhrase === 'string')
        recursiveSearchString(searchItem, searchMatches, []);
    else if (typeof searchPhrase === 'function')
        recursiveSearchFunction(searchItem, searchMatches, []);
    else 
        throw 'the searchPhrase parameter must be a string or a function';
    return searchMatches;

};