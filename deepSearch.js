/*************************************************************************
 * Gets all the course's item[key] details, flatten them, then search through
 * each item[key] searching for a match
 *************************************************************************/
const asynclib = require('async');
const canvas = require('canvas-api-wrapper');
var valueCounter = 0;
var objectCounter = 0;

module.exports = function deepSearch(searchPhrase, searchItem) {
    var item = [].concat(searchItem);
    
    function compareValues (searchPhrase, searchValue) {
        searchPhrase = new RegExp (String.toString(searchPhrase), 'i');
        return searchPhrase.test( String.toString(searchValue) );
    }

    function recursiveSearch (item, accumulator, searchPath = []) {
        if (typeof item === 'object' && item !== null) {
            console.log(`Object Found: ${objectCounter++}`);
            console.dir(item, {depth: null});
            Object.keys(item).forEach( key => { recursiveSearch(item[key], accumulator, searchPath.concat(key)); } );
        // FIXME this else if never fires... ever. find out why!
        } else if (compareValues(searchPhrase, item)) {
            console.log(`Value Found: ${valueCounter++}`);
            console.dir(item, {depth: null});
            accumulator.push({match: item, path: searchPath});
            return accumulator;
        }
    }
    
    return Object.keys(searchItem).reduce( (acc, key) => {
        acc.push(recursiveSearch(item[key], acc, [].concat(key)));
        return acc;
    }, [] );
};

// var deepItem = [{one: 1, oneTwo: {one: 'one', two: 'two'} },{two: 2, arr: [0,1,2,3,4,5,6,[8,9,10,[11]]] },{food: {taco: 'taco', burrito: 'burrito', cheese: 'cheese', more: {moar: 'moar!!!!'} }}]