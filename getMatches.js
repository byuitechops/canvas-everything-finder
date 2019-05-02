/*************************************************************************
 * Gets all the course's item details, then deep-search through
 * each item searching for a match
 *************************************************************************/
const path = require('path');
const canvas = require('canvas-api-wrapper');
const deepSearch = require('./deepSearch.js');
const limitObjectKeys = require('./limitObjectKeys.js');

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

async function getSubItems(initialId, subItemKey, initialApiCall, secondaryApiCall) {
    let courseItems = await canvas.get(initialApiCall(initialId));
    let apiCalls = courseItems.map((item) => secondaryApiCall(initialId, item[subItemKey]));
    return apiCalls;
}


module.exports = async function getCourseItems(course, searchPhrase) {
    // Define API Calls Here. Listed as an object to have readable named values
    var canvasApiCalls = [
        `/api/v1/courses/${course.id}/modules/?include[]=items`,
        // ...await getSubItems(course.id, 'id', (initialId) => `/api/v1/courses/${initialId}/modules/`, (initialId, subId) => `/api/v1/courses/${initialId}/modules/${subId}/items`),
        // `/api/v1/courses/${course.id}/assignments`, // getAssignments
        // `/api/v1/courses/${course.id}/pages`, // listPages
        // `/api/v1/courses/${course.id}/modules`, // listModules
        // `/api/v1/courses/${course.id}/quizzes`, // getQuizzes
        // `/api/v1/courses/${course.id}/discussion_topics`, // getDiscussionTopics (aka discussion boards)
        // ...await getSubItems(course.id, 'url', (initialId) => `/api/v1/courses/${initialId}/pages`, (initialId, subId) => `/api/v1/courses/${initialId}/pages/${subId}`),
        // ...await getSubItems(course.id, 'id', (initialId) => `/api/v1/courses/${initialId}/quizzes`, (initialId, subId) => `/api/v1/courses/${initialId}/quizzes/${subId}/questions`),
    ];
    // let getQuizQuestions = await getSubItems(course.id, (initialId) => `/api/v1/courses/${initialId}/quizzes`, (initialId, subId) => `/api/v1/courses/${initialId}/quizzes/${subId}/questions`); // getQuizQuestions
    // let getModuleItems = await getSubItems(course.id, (initialId) => `/api/v1/courses/${initialId}/modules/`, (initialId, subId) => `/api/v1/courses/${initialId}/modules/${subId}/items`); // getModuleItems
    // canvasApiCalls = canvasApiCalls.concat(getQuizQuestions, getModuleItems)
    // console.log(canvasApiCalls)

    // Core: Search, scan, report
    var allMatches = [];
    var outputKeys = ['id', 'name', 'items_url', 'items'];
    for (let apiCall in canvasApiCalls) { // for in opted for to avoid having to do: promise.all(array.method(async () => {} ))
        let response = await canvas.get(canvasApiCalls[apiCall]);
        let canvasData = Array.isArray(response) ? response : canvasData.concat(response);
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
    if (allMatches.length === 0) allMatches.push(makeOutputObject(course, {}, {}, searchPhrase, ''));

    return allMatches;
};