module.exports = {
    customCourseList,
    getSearchPhraseFunction,
    customCourseScope,
    limitCustomCourseScopeKeys,
    prepResultsForCSV,
};

/**************************************************************
 *  Used in:  the getCoursesFromHardCodedFunction function.
 *  Used to:  programatically get a specific list of courses to
 *            search in 
 *  Takes in: the CanvasApiWrapper as a dependency via parameters
 *  returns:  a list of canvas course objects 
 **************************************************************/
async function customCourseList (canvas) {
    var courses = [
        10171, // AGBUS 105 OM
        2794,  // AUTO  125 OM
        11998, // BUS   115 OM
        19244, // CONST 221 OM
        11525, // CS    101 OM
        10150, // FAML  160 OM
        10178, // HS    240 OM
        16397, // HTMBC 110 OM
        32620, // REL   261 OM
        11480, // SMMBC 105 OM
        10153, // TESOL 101 OM
        52042, // WDD   130 OM
    ];
    courses = await Promise.all(courses.map(async cid => await canvas.get(`/api/v1/courses/${cid}?`) ));
    return courses; 
    // var subAccounts = [
    // {
    //     name: `campusScaled`,
    //     id: 48
    // }];
    // var terms = [{
    //     name: "Winter 2019",
    //     id: 93
    // }];

    // var stuff = require('canvas-get-scaled-courses');
    // return await stuff(subAccounts, terms);
}

/**************************************************************
 *  takes in: the original search phrase recieved from main / the cli
 *  Used to:  define a function that specifies how to determine 
 *            whether a match was while searching canvas.
 *            If you want to search for the phrase provided exactly,
 *            simply return the searchPhrase parameter.
 *  returns:  a function that returns true or false or a string
 **************************************************************/
function getSearchPhraseFunction (searchPhrase) 
{
    return (value) => /http[s]?:\/\/(?:[a-z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-f][0-9a-f]))+/gi.test(value)
    // return searchPhrase;
}

/**************************************************************
 *  takes in: a canvas course object
 *  Used to:  Generate a list of canvas URLs
 *  returns:  a list of api call url strings. 
 *            The consuming function uses those url strings 
 *            to make the calls.
 **************************************************************/
async function customCourseScope (course) {
    var canvasApiCalls = [
        // `/api/v1/courses/${course.id}/modules/?include[]=items`,
        `/api/v1/courses/${course.id}/modules`, // listModules
        ...await getSubItems(course.id, 'id', (initialId) => `/api/v1/courses/${initialId}/modules/`, (initialId, subId) => `/api/v1/courses/${initialId}/modules/${subId}/items`), // getModuleItems
        `/api/v1/courses/${course.id}/assignments`, // getAssignments
        `/api/v1/courses/${course.id}/pages`, // listPages
        `/api/v1/courses/${course.id}/quizzes`, // getQuizzes
        `/api/v1/courses/${course.id}/discussion_topics`, // getDiscussionTopics (aka discussion boards)
        ...await getSubItems(course.id, 'url', (initialId) => `/api/v1/courses/${initialId}/pages`, (initialId, subId) => `/api/v1/courses/${initialId}/pages/${subId}`), // page details
        // ...await getSubItems(course.id, 'id', (initialId) => `/api/v1/courses/${initialId}/quizzes`, (initialId, subId) => `/api/v1/courses/${initialId}/quizzes/${subId}/questions`), // getQuizQuestions
        // `api/v1/courses/${course.id}/tabs`
    ];
    return canvasApiCalls();

    // this is hoisted and is meant to be private, so it's fine here
    async function getSubItems(initialId, subItemKey, initialApiCall, secondaryApiCall) {
        let courseItems = await canvas.get(initialApiCall(initialId));
        let apiCalls = courseItems.map((item) => secondaryApiCall(initialId, item[subItemKey]));
        return apiCalls;
    }
}

/**************************************************************
 *  Used to: limit the data from canvas details obtained.
 *           doing so reduces memory footprint of program
 *           during runtime.
 * To limit no keys, use an empty array.
 **************************************************************/
var limitCustomCourseScopeKeys = [
    'id',
    'name',
    'items_url',
    'items',
    'external_tool_tag_attributes',
];

/**************************************************************
 *  takes in: a list of all the results found
 *  Used to:  transform the json data into a csv friendly format
 *  returns:  a javascript object in a csv friendly format
 **************************************************************/
function prepResultsForCSV (matches) {
    matches = matches.map(match => {
        // This preps the object so that the csv object wont throw.
        if (match.item.external_tool_tag_attributes === undefined) match.item.external_tool_tag_attributes = {}
        let items = {};
        if (match.matchData.path !== null && match.matchData.path !== undefined) {
            try {
                let matchObjectPath = match.matchData.path.slice(0,-1);
                items = objectCrawler(match.item, matchObjectPath) || {};
            } catch (e) {
                console.error(e);
            }
        }
        // This transforms results into a csv friendly format.
        return {
            'course.id': match.course.id,
            'course.course_code': match.course.course_code,
            'course.name': match.course.name,
            'course.sis_course_id': match.course.sis_course_id,
            'item.id': match.item.id,
            'item.name': match.item.name,
            'item.items_url': match.item.items_url,

            'item.items.content_id':   items.id,
            'item.items.title':        items.title,
            'item.items.external_url': items.external_url,

            'item.external_tool_tag_attributes.url': match.item.external_tool_tag_attributes.url,

            'matchData.match': match.matchData.match,
            'matchData.path': JSON.stringify(match.matchData.path),
            'apiCall': match.apiCall,
            'message': match.message,
            'searchPhrase': match.searchPhrase,
        };
    });
}