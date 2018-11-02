const path = require('path');
const getMatches = require( path.join(__dirname, '/getMatches.js') );

var courseItem = {
    id: 16762,
    course_code: 'Aaron',
    name: 'Aaron Shiffler Sandbox',
};


async function test () {
    var matches = await getMatches(courseItem, 'demo');
    console.dir(matches, {depth: 2});
    console.log(matches.length);
}

test();
