
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



// TODO Abstract cli input and csv output parts of this function and let them be run in a true index file so that this can be more modular
async function main() {
    var queueLimit = 10;
    var courseCounter = 0;
    var userInput = await cli();
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
        matches = matches.map(match => {
            if (match.item.external_tool_tag_attributes === undefined) match.item.external_tool_tag_attributes = {}
            let externalToolItems = {};
            if (match.matchData.path !== null && match.matchData.path !== undefined) {
                debugger;
                try {
                    let matchObjectPath = match.matchData.path.slice(0,-1);
                    externalToolItems = objectCrawler(match.item, matchObjectPath) || {};
                } catch (e) {
                    console.error(e);
                }
            }
            return {
                'course.id': match.course.id,
                'course.course_code': match.course.course_code,
                'course.name': match.course.name,
                'course.sis_course_id': match.course.sis_course_id,
                'item.id': match.item.id,
                'item.name': match.item.name,
                'item.items_url': match.item.items_url,

                'item.items.content_id':   externalToolItems.content_id,
                'item.items.title':        externalToolItems.title,
                'item.items.external_url': externalToolItems.external_url,

                'item.external_tool_tag_attributes.url': match.item.external_tool_tag_attributes.url,

                'matchData.match': match.matchData.match,
                'matchData.path': JSON.stringify(match.matchData.path),
                'apiCall': match.apiCall,
                'message': match.message,
                'searchPhrase': match.searchPhrase,
            };
        });
        var csvFormatted = d3.csvFormat(matches);

        fs.writeFileSync(userInput.saveLocation, csvFormatted);

        console.log('THE PROGRAM HAS FINISHED RUNNING. YOU CAN NOW SAFELY EXIT');
    }

}

main();