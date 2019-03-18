
const fs = require('fs');
const path = require('path');
const d3 = require('d3-dsv');
// const asynclib = require('async');
// const getMatchesAsyncLib = require( path.join(__dirname, '/getMatchesAsyncLib.js') );
const cli = require('./cli.js');
const getCourses = require('./getCourses.js');
const getMatches = require('./getMatches.js');
const getMemoryStats = require('./getMemoryStats.js');
const promiseQueueLimit = require('./promiseQueueLimit.js');
const repeatOnInterval = require('./repeatOnInterval.js');



// TODO Abstract cli input and csv output parts of this function and let them be run in a true index file so that this can be more modular
async function main() {
    var queueLimit = 10;
    var courseCounter = 0;
    var userInput = await cli();
    // repeatOnInterval([getMemoryStats], 5000); // Start Tracking Memory Usage
    var courseList = await getCourses(userInput.inputType, userInput.courseData);

    console.log(`\nYou have found ${courseList.length} courses!\n`);

    async function getMatchesAdapter(course) {
        return new Promise(async (resolve, reject) => {
            getMatches(course, userInput.searchPhrase)
                .then((matchData) => {
                    console.log(`${++courseCounter}/${courseList.length}, ${course['name']} Completed`);
                    resolve(matchData);
                })
                .catch((error) => {
                    console.log(`${++courseCounter}/${courseList.length}, ${course['name']} Completed`);
                    reject({ course: course, item: {}, matchData: {}, searchPhrase: userInput.searchPhase, apiCall: '', message: error });
                });
        });
    }

    await promiseQueueLimit(courseList, getMatchesAdapter, queueLimit, closingSteps);

    function closingSteps(err, matches) {
        matches = matches.map(item => {
            return {
                'course.id': item.course.id,
                'course.course_code': item.course.course_code,
                'course.name': item.course.name,
                'item.id': item.item.id,
                'item.name': item.name,
                'item.html_url': item.html_url,
                'matchData.match': item.matchData.match,
                'matchData.path': JSON.stringify(item.matchData.path),
                'searchPhrase': item.searchPhrase,
                'apiCall': item.apiCall,
                'message': item.message,
            };
        });
        var csvFormatted = d3.csvFormat(matches, [
            'course.id',
            'course.course_code',
            'course.name',
            'item.id',
            'item.name',
            'item.html_url',
            'matchData.match',
            'matchData.path',
            'apiCall',
            'message',
            'searchPhrase',
        ]);

        fs.writeFileSync(userInput.saveLocation, csvFormatted);

        console.log('THE PROGRAM HAS FINISHED RUNNING. YOU CAN NOW SAFELY EXIT');
    }

}

main();