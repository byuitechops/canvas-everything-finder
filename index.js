
const path = require('path');
const asynclib = require('async');
const d3 = require('d3-dsv');
const cli                = require( path.join(__dirname, '/cli'               ) );
const getCourses         = require( path.join(__dirname, '/getCourses'        ) );
const getMatchesAsyncLib = require( path.join(__dirname, '/getMatchesAsyncLib') );
const getMemoryStats     = require( path.join(__dirname, '/getMemoryStats'    ) );

// Do stuff over and over forever
async function recursion(functions = []) {
    setTimeout(() => {
        functions.forEach( (funct) => {
            funct();
        } );
        recursion(functions);
    }, 5000);
}

// Only run these if testing state is true
// testing([getMemoryStats]);
function testing (functions = []) {
    if (process.argv[2] === 'true') {
        functions.forEach( (funct) => {
            funct();
        } );
    }
}


// TODO Abstract cli input and csv output parts of this function and let them be run in a true index file so that this can be more modular
async function main() {
    var userInput = await cli(); 
    testing([getMemoryStats]);
    var courseList = await getCourses(userInput.inputType, userInput.courseData);
    testing([getMemoryStats]);
    console.log(`\nYou have found ${courseList.length} courses!\n`);
    recursion([/* console.clear,  */getMemoryStats]);
    asynclib.mapLimit(courseList, 1, async (course, callback) => await getMatchesAsyncLib(course, userInput.searchPhrase, callback), (err, collection) => {
        /* d3.csvFormat(collection, [
            'courseId',
            'courseCode',
            'courseName',
            'matchId',
            'matchType',
            'matchTitle',
            'matchIntralink',
            'matchExtralink',
            'searchPhrase',
            'errors',
        ]); */
    });
}

main();