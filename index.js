
const fs = require('fs');
const path = require('path');
const d3 = require('d3-dsv');
// const asynclib = require('async');
// const getMatchesAsyncLib = require( path.join(__dirname, '/getMatchesAsyncLib.js') );
const cli = require('./cli.js');
const getCourses = require('./getCourses.js');
const getMatches = require('./getMatches.js');
const objectCrawler = require('./objectCrawler.js');
const getMemoryStats = require('./getMemoryStats.js');
const promiseQueueLimit = require('./promiseQueueLimit.js');
const repeatOnInterval = require('./repeatOnInterval.js');
const settings = require('./settings.js');



// TODO Abstract cli input and csv output parts of this function and let them be run in a true index file so that this can be more modular
async function main() {
    var queueLimit = 10;
    var courseCounter = 0;
    var userInput = await cli();
    userInput.searchPhrase = settings.getSearchPhraseFunction(userInput.searchPhrase);
    // repeatOnInterval([getMemoryStats], 5000); // Start Tracking Memory Usage
    var courseList = await getCourses(userInput.inputType, userInput.courseData);
    // courseList = courseList.slice(0,10)

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

    function closingSteps (err, matches) {
        // Backup your raw results in case this doesn't work
        fs.writeFileSync(`${userInput.saveLocation}.json`, JSON.stringify(arguments[2],null,4));
        // Preps the json data for CSV serialization
        matches =  settings.prepResultsForCSV(matches);
        var csvFormatted = d3.csvFormat(matches);

        fs.writeFileSync(userInput.saveLocation, csvFormatted);

        console.log('THE PROGRAM HAS FINISHED RUNNING. YOU CAN NOW SAFELY EXIT');
    }

}

main();