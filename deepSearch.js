/*************************************************************************
 * Gets all the course's item[key] details, flatten them, then search through
 * each item[key] searching for a match
 *************************************************************************/

module.exports = function deepSearch(searchPhrase, searchItem) {
    var item = [].concat(searchItem);
    
    function compareValues (searchPhrase, searchValue) {
        if (typeof searchValue === 'undefined') searchValue = typeof undefined;
        let search = typeof searchPhrase === 'string' ? searchPhrase : searchPhrase.toString();
        let value = typeof searchValue === 'string' ? searchValue : searchValue.toString();
        let searchExp = new RegExp (search, 'i');
        return searchExp.test( value );
    }

    function recursiveSearch (item, accumulator, searchPath = []) {
        if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach( key => { recursiveSearch(item[key], accumulator, searchPath.concat(key)); } );
        } else if (compareValues(searchPhrase, item)) {
            accumulator.push({match: item, path: searchPath});
        }
    }
    
    return Object.keys(item).reduce( (acc, key) => {
        recursiveSearch(item[key], acc, [].concat(key));
        return acc;
    }, [] );
};