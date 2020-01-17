
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
    userInput.searchPhrase = (value) => /<iframe[\w\W\n]*?kaltura\.com[\w\W\n]*?<\/iframe>/gi.test(value);
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
        fs.writeFileSync(`${userInput.saveLocation}.json`, JSON.stringify(arguments[2],null,4));
        matches = matches.map(match => {
            if (match.item.external_tool_tag_attributes === undefined) match.item.external_tool_tag_attributes = {}
            let items = {};
            if (match.matchData.path !== null && match.matchData.path !== undefined) {
                debugger;
                try {
                    let matchObjectPath = match.matchData.path.slice(0,-1);
                    items = objectCrawler(match.item, matchObjectPath) || {};
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
        var csvFormatted = d3.csvFormat(matches);

        fs.writeFileSync(userInput.saveLocation, csvFormatted);

        console.log('THE PROGRAM HAS FINISHED RUNNING. YOU CAN NOW SAFELY EXIT');
    }

}

main();