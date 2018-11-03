
const fs = require('fs');
const path = require('path');
// const asynclib = require('async');
const d3 = require('d3-dsv');
const cli                = require( path.join(__dirname, '/cli.js'               ) );
const getCourses         = require( path.join(__dirname, '/getCourses.js'        ) );
// const getMatchesAsyncLib = require( path.join(__dirname, '/getMatchesAsyncLib.js') );
const getMatches         = require( path.join(__dirname, '/getMatches.js'        ) );
const getMemoryStats     = require( path.join(__dirname, '/getMemoryStats.js'    ) );


async function recursion(functions = []) {
    setTimeout(() => {
        functions.forEach((funct) => {
            funct();
        });
        recursion(functions);
    }, 5000);
}

// TODO Abstract cli input and csv output parts of this function and let them be run in a true index file so that this can be more modular
async function main() {
    var courseCounter = 0;
    var userInput = await cli();
    recursion([getMemoryStats]); // Start Tracking Memory Usage
    var courseList = await getCourses(userInput.inputType, userInput.courseData);

    console.log(`\nYou have found ${courseList.length} courses!\n`);

    var matchReport = [];
    function* parallelQueue () {
        if ( parallelQueue.queueLimit   === undefined || typeof parallelQueue.queueLimit   !== 'number') parallelQueue.queueLimit = 1000;
        if ( parallelQueue.currentQueue === undefined || typeof parallelQueue.currentQueue !== 'number') parallelQueue.currentQueue = 0;
        for (let course in courseList) {
            while (parallelQueue.currentQueue >= parallelQueue.queueLimit) {
                yield parallelQueue.currentQueue;
            }
            ++parallelQueue.currentQueue;
            getMatches(courseList[course], userInput.searchPhrase)
                .then( (matchData) => {
                    matchReport = matchReport.concat(matchData);
                    --parallelQueue.currentQueue;
                    console.log(`${++courseCounter}/${courseList.length}, ${courseList[course]['name']} Completed`);
                } )
                .catch( (error) => { 
                    matchReport = matchReport.concat( {course: course, item: {}, matchData: {}, searchPhrase: userInput.searchPhase, apiCall: '', message: error} );
                    --parallelQueue.currentQueue;
                    console.log(`${++courseCounter}/${courseList.length}, ${courseList[course]['name']} Completed`);
                } );
        }
    }
    var pqVar = parallelQueue();
    async function recursiveTimeout () {
        await setTimeout(async () => {
            if (pqVar.next().value !== undefined) {
                // console.log(`${parallelQueue.currentQueue}/${parallelQueue.queueLimit}`);
                await recursiveTimeout();
            } else if (pqVar.next().value === undefined && parallelQueue.currentQueue <= 0) {
                console.log('Beginning Closing Steps...');
                closingSteps();
            } else {
                await setTimeout(async () => {
                    console.log(`There are ${parallelQueue.currentQueue} jobs still running`);
                    console.log('Please wait... We are preping the information to be written to your hard drive...');
                    console.log();
                    await recursiveTimeout();
                }, 5000);
            }
        }, 10);
    }

    await recursiveTimeout();


    function closingSteps () {
        matchReport = matchReport.map(item => {
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
        var csvFormatted = d3.csvFormat(matchReport, [
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
    

    /* asynclib.mapLimit(courseList, 1, async (course, callback) => await getMatchesAsyncLib(course, userInput.searchPhrase, callback), (err, collection) => {
        console.log(collection);
        collection = collection.map( item => {
            return {
                'course.id'          : item.course.id,
                'course.course_code' : item.course.course_code,
                'course.name'        : item.course.name,
                'item.id'            : item.item.id,
                'item.name'          : item.name,
                'item.html_url'      : item.html_url,
                'matchData.match'    : item.matchData.match,
                'matchData.path'     : JSON.stringify(item.matchData.path),
                'searchPhrase'       : item.searchPhrase,
                'apiCall'            : item.apiCall,
                'message'            : item.message,
            };
        } );
        d3.csvFormat(collection, [
            'course.id',
            'course.course_code',
            'course.name',
            'item.id',
            'item.name',
            'item.html_url',
            'matchData.match',
            'matchData.path',
            'searchPhrase',
            'apiCall',
            'message',
        ]);
    }); */
}

main();