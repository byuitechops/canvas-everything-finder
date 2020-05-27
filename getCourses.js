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
        var courses = await canvas.get(`/api/v1/accounts/${accountNumber}/courses?`);
        return courses.map( course => limitObjectKeys(course, outputKeys) );
    }

    async function getCoursesFromHardCodedFunction (ghostVar) {         
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
    }
    // async function getCoursesFromHardCodedFunction (ghostVar) {         
    //     var subAccounts = [
    //     {
    //         name: `campusScaled`,
    //         id: 48
    //     }];
    //     var terms = [{
    //         name: "Winter 2019",
    //         id: 93
    //     }];

    //     var stuff = require('canvas-get-scaled-courses');
    //     return await stuff(subAccounts, terms);
    // }

    // If new keys need to be included, just add them to the outputKeys array.
    var outputKeys = ['name', 'id', 'course_code', 'sis_course_id'];
    
    var getCourses = {
        fromCsv: getCoursesFromCsv,
        fromApi: getCoursesFromApi,
        fromHardCodedFunction : getCoursesFromHardCodedFunction
    };

    return getCourses[inputType](pieceOfData);
};