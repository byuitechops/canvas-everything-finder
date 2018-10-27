/*************************************************************************
 * Runs get Matches, but is in charge of making it compatible with asyncLib
 * by giving it a callback. It also handles unhandled errors in a non-breaking way
 *************************************************************************/
module.exports = async function getCourses(course, searchPhrase, callback) {
    const getMatches = require('./getMatches');
    await getMatches(course, searchPhrase)
        .then( (matches) => callback(null, matches) )
        .catch( (error) => callback(null, Object.assign(course, error)) );
    return;
};