/*************************************************************************
 * Handles getting input from the user via a cli.
 *************************************************************************/
module.exports = async function cli () {
    const inquirer = require('inquirer'); // NPM
    const prompts = require('./cliPrompts.js'); // Local
    let userInput = inquirer.prompt(prompts);
    return userInput;
};