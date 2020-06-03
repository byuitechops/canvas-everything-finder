/*************************************************************************
 * Gets all the course's item details, then deep-search through
 * each item searching for a match
 *************************************************************************/
const path = require('path');
const canvas = require('canvas-api-wrapper');
const deepSearch = require('./deepSearch.js');
const limitObjectKeys = require('./limitObjectKeys.js');
const settings = require('./settings.js');

module.exports = async function getCourseItems(course, searchPhrase) {
    // Define API Calls Here. Listed as an object to have readable named values
    var canvasApiCalls = await settings.customCourseScope(course);
    
    // Core: Search, scan, report
    var allMatches = [];
    var outputKeys = settings.limitCustomCourseScopeKeys();
    for (let apiCall in canvasApiCalls) { // for in opted for to avoid having to do: promise.all(array.method(async () => {} ))
        let response = await canvas.get(canvasApiCalls[apiCall]);
        let canvasData = Array.isArray(response) ? response : [response];
        let theseMatches = canvasData.reduce((acc, data) => {
            let matches = deepSearch(data, searchPhrase);
            let outputData = limitObjectKeys(data, outputKeys);
            matches.forEach((match) => acc = acc.concat(makeOutputObject(course, outputData, match, searchPhrase, canvasApiCalls[apiCall])));
            return acc;
        }, []);
        allMatches = allMatches.concat(theseMatches);
    }

    // If no matches were found in this course, tag the outputTemplate
    // onto the output so that the course is represented on the output
    if (allMatches.length === 0) 
        allMatches.push(makeOutputObject(course, {}, {path:[], match:''}, searchPhrase, '', 'No Matches Found'));

    return allMatches;
};

function makeOutputObject(courseObject, itemObject, matchData, searchPhrase, apiCall, message = '') {
    return {
        course: courseObject,
        item: itemObject,
        matchData: matchData,
        searchPhrase: searchPhrase,
        apiCall: apiCall,
        message: message,
    };
}