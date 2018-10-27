const path = require('path');

const padding = 47;

const subdomains = {
    byui: 'byui',
    byui_test: 'byui.test'
};

const inputType = {
    accountNumber: 'Account Number',
    csvInput: 'CSV Input',
};

const inputTypeAnswerTransformer = {
    [inputType.accountNumber]: 'fromApi',
    [inputType.csvInput]: 'fromCsv',
};

function inquirerObjectToArray (answersHash, object) {
    return Object.keys(object).map( (key) => object[key] );
}

let courseData = 'courseData';

module.exports = [
    {
        // (General) Get Seach Phrase
        name: 'searchPhrase',
        type: 'input',
        message: 'Enter the phrase that you are looking for'.padEnd(padding),
        suffix: ':',
        default: 'external_tools/sessionless',
    },
    {
        // (General) Get Subdomain
        name: 'subdomain',
        type: 'list',
        message: 'Which subdomain would you like to search?'.padEnd(padding),
        suffix: ':',
        choices: (answersHash) => inquirerObjectToArray(answersHash, subdomains),
        default: subdomains.byui,
    },
    {
        // (Get Courses) Get Input Type
        name: 'inputType',
        type: 'list',
        message: 'How would you like to search courses?'.padEnd(padding),
        suffix: ':',
        choices: (answersHash) => inquirerObjectToArray(answersHash, inputType),
        default: inputType.accountNumber,
        filter: (answer) => inputTypeAnswerTransformer[answer],
    },
    {
        // (Get Courses) Get Account Number
        name: 'accountNumber',
        when: (answersHash) => answersHash.inputType === inputTypeAnswerTransformer[inputType.accountNumber],
        type: 'input',
        message: 'Which account number would you like to search?'.padEnd(padding),
        suffix: ':',
        default: 8,
        filter: (answer, answersHash) => {
            answersHash[courseData] = answer;
            return answer;
        },
    },
    {
        // (Get Courses Options) Account Number Follow-Up Question: to include the subaccounts or not
        name: 'inludeNestedAccounts',
        when: (answersHash) => answersHash.inputType === inputTypeAnswerTransformer[inputType.accountNumber],
        type: 'confirm',
        message: 'Would you like to search nested accounts?'.padEnd(padding),
        suffix: ':',
        default: false,
    },
    {
        // (Get Courses) Get CSV Location
        name: 'csvLocation',
        when: (answersHash) => answersHash.inputType === inputTypeAnswerTransformer[inputType.csvInput],
        type: 'input',
        message: 'Enter the path to the csv to read from'.padEnd(padding),
        suffix: ':',
        default: '',
        filter: (answer, answersHash) => {
            let output = path.resolve(answer);
            answersHash[courseData] = answer;
            return output;
        },
    },
    {
        // (General) Where to output the file
        name: 'saveLocation',
        type: 'input',
        message: 'Where to save your csv? (Default: ./reports)'.padEnd(padding),
        suffix: ':',
        default: './reports',
        filter: (input) => path.resolve(input)
    },
];