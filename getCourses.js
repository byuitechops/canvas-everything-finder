/*************************************************************************
 * Handles getting a list of courses using the chosen method
 *************************************************************************/
// testing([getMemoryStats]);
function testing(functions = []) {
    if (process.argv[2] === 'true') {
        functions.forEach((funct) => {
            funct();
        });
    }
}

module.exports = function getListOfCourses(inputType, pieceOfData) {
    const fs = require('fs'); // Node
    const d3 = require('d3-dsv'); // NPM
    const canvas = require('canvas-api-wrapper'); // NPM
    const getMemoryStats = require('./getMemoryStats');
    // If new keys need to be included, just add them to the outputKeys array.
    var outputKeys = ['name', 'id', 'course_code'];

    // Get course name, id, and code from a csv
    function getCoursesFromCsv (csvLocation) {
        // TODO Read Only ID from CSV, then get other info from an API Call to ensure accuracy
        // the parse, format, and parse is done to take advantage of d3's key limiter
        let course = d3.csvParse( fs.readFileSync(csvLocation, 'utf8'), (d) => {
            return outputKeys.reduce( (acc, outputKey) => acc[outputKey] = d[outputKey], {} );
        } );
        return course;
    }

    // Get course name, id, and code from an api call
    async function getCoursesFromApi (accountNumber) {
        var courses = await canvas.get(`/api/v1/accounts/${accountNumber}/courses`);
        testing([getMemoryStats]);
        return courses.map( course => {
            return outputKeys.reduce( (acc, outputKey) => {
                acc[outputKey] = course[outputKey];
                return acc;
            }, {} );
        } );
    }

    var getCourses = {
        fromCsv: getCoursesFromCsv,
        fromApi: getCoursesFromApi,
    };

    return getCourses[inputType](pieceOfData);
};