/*************************************************************************
 * Gets all the course's item details, then deep-search through
 * each item searching for a match
 *************************************************************************/
const path = require('path');
const canvas = require('canvas-api-wrapper');
const deepSearch = require( path.join(__dirname, '/deepSearch.js') );
const limitObjectKeys = require( path.join(__dirname, '/limitObjectKeys.js') );

function makeOutputObject (courseObject, itemObject, matchData, searchPhrase, apiCall, message = '') {
    return {
        course       : courseObject, 
        item         : itemObject, 
        matchData    : matchData, 
        searchPhrase : searchPhrase, 
        apiCall      : apiCall, 
        message      : message,
    };
}

module.exports = async function getCourseItems(course, searchPhrase) {
    // Define API Calls Here. Listed as an object to have readable named values
    var canvasApiCalls = {
        getAssignments: `/api/v1/courses/${course.id}/assignments`,
        listPages: `/api/v1/courses/${course.id}/pages`,
        listModules: `/api/v1/courses/${course.id}/modules?include[]=items`,
        // listQuizzes: `/api/v1/courses/${course.id}/quizzes`
    };

    // Core: Search, scan, report
    var allMatches = [];
    var outputKeys = ['id','name','html_url','title','external_url','content_id'];
    for (let apiCall in canvasApiCalls) { // for in opted for to avoid having to do: promise.all(array.method(async () => {} ))
        let canvasData = await canvas.get(canvasApiCalls[apiCall]);
        allMatches = canvasData.reduce( (acc, data) => {
            let matches = deepSearch(data, searchPhrase);
            let outputData = limitObjectKeys(data, outputKeys);
            matches.forEach( (match) => acc = acc.concat( makeOutputObject(course, outputData, match, searchPhrase, canvasApiCalls[apiCall]) ) );
            return acc;
        }, []);
    }

    // If no matches were found in this course, tag the outputTemplate
    // onto the output so that the course is represented on the output
    if (allMatches.length === 0) allMatches.push( makeOutputObject(course, {}, {}, searchPhrase, '') );

    return allMatches;
};