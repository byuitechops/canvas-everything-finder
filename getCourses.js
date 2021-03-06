/*************************************************************************
 * Handles getting a list of courses using the chosen method
 *************************************************************************/
const fs = require('fs'); // Node
const path = require('path'); // Node
const d3 = require('d3-dsv'); // NPM
const canvas = require('canvas-api-wrapper'); // NPM
const limitObjectKeys = require(path.join(__dirname,'/limitObjectKeys') ); // Local

module.exports = function getListOfCourses(inputType, pieceOfData) {
    // Get course name, id, and code from a csv
    function getCoursesFromCsv (csvLocation) {
        // TODO Read Only ID from CSV, then get other info from an API Call to ensure accuracy
        let course = d3.csvParse( fs.readFileSync(csvLocation, 'utf8'), (d) => {
            return limitObjectKeys(d, outputKeys);
        } );
        delete course.columns;
        return course;
    }

    // Get course name, id, and code from an api call
    async function getCoursesFromApi (accountNumber) {
        var courses = await canvas.get(`/api/v1/accounts/${accountNumber}/courses`);
        return courses.map( course => limitObjectKeys(course, outputKeys) );
    }

    // If new keys need to be included, just add them to the outputKeys array.
    var outputKeys = ['name', 'id', 'course_code'];
    
    var getCourses = {
        fromCsv: getCoursesFromCsv,
        fromApi: getCoursesFromApi,
    };

    return getCourses[inputType](pieceOfData);
};