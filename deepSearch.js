/*************************************************************************
 * Gets all the course's item details, flatten them, then search through
 * each item searching for a match
 *************************************************************************/
const asynclib = require('async');
const canvas = require('canvas-api-wrapper');

module.exports = function deepSearch(searchPhrase, canvasItems) {
    function recursiveSearch(canvasItem) {
        // Define what to do if the item is an object
        function recursionOnObject (canvasItem) {
            Object.keys(canvasItem);
        }

        // 
        function recursionOnValue  (canvasItem) {}

        //
        if ( Array.isArray(canvasItem) ) return recursionOnArrary(canvasItem);
        else if ( canvasItem !== null && typeof canvasItem === 'object' ) return recursionOnObject(canvasItem);
        else return recursionOnValue(canvasItem);
    }
    return canvasItems.reduce( (acc, canvasItem) => {
        return acc.concat( recursiveSearch(canvasItem) );
    }, [] );
};