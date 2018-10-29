/*************************************************************************
 * Gets all the course's item details, flatten them, then search through
 * each item searching for a match
 *************************************************************************/
const asynclib = require('async');
const canvas = require('canvas-api-wrapper');
const deepSearch = require('./deepSearch');

module.exports = function getCourses(course, searchPhrase) {
    // This var is temporarily here so that I know what I want my eventual output to look like
    course = Object.assign(course, {
        matchId: null,
        matchType: null,
        matchTitle: null,
        matchIntralink: null,
        matchExtralink: null,
        searchPhrase: searchPhrase,
        errors: 'No Matches',
    });

    // Define API Calls Here
    var canvasApiCalls = {
        getAssignments: `/api/v1/courses/${course.id}/assignments`,
    };

    // Decide which ones to run here
    var apiCalls = [
        canvasApiCalls.getAssignments,
    ];

    // Core: Search, scan, report
    let allMatches = apiCalls.reduce( async (acc, apiCall) => {
        var matches = [];
        await canvas.get(apiCall) // Get Items from API Call
            .then( (canvasItems) => { matches = deepSearch(searchPhrase, canvasItems); }) // Run Stuff through deepSearcher
            .catch( (error) => {matches = {errors: error};} ); // "Don't stop the train" -Josh
        matches = Object.assign(course, matches); // Make copy, letting new data overwrite old data
        return acc.concat(matches); // Flatten matches, and concat to accumulator
    }, [] );

    // If no matches were found in this course, tag the outputTemplate 
    // onto the output so that the course is represented on the output
    if (allMatches.length === 0) allMatches.push(course);

    return allMatches;
};