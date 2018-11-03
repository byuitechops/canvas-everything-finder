var path = require('path');
var deepSearch = require('./deepSearch');
var searchTerm = 'o';



var deepItem = [
    {
        one: 1,
        oneTwo: {
            one: 'one',
            two: 'two'
        }
    }, 
    {
        two: 2,
        arr: [0, 1, 2, 3, 4, 5, 6, [8, 9, 10, [11]]]
    }, 
    {
        food: {
            taco: 'taco',
            burrito: 'burrito',
            cheese: 'cheese',
            more: {
                moar: 'moar!!!!',
            }
        }
    },
    {
        null: null,
        undef: undefined,
        emptyObj: {}, // FIXME??? Cant search for empty objects
        emptyArr: [], // FIXME??? Cant search for empty arrays
        function: () => {} // NOTE: Shows up when searching '{}'. 
    }
];

/* deepItem = {
    a: {
        one: 1,
        oneTwo: {
            one: 'one',
            two: 'two'
        }
    },
    b: {
        two: 2,
        arr: [0, 1, 2, 3, 4, 5, 6, [8, 9, 10, [11]]],
        bool: {
            trueBool: true,
            trueStr: 'true',
            falseBool: false, 
            falseStr: 'false'
        }
    },
    c: {
        food: {
            taco: 'taco',
            burrito: 'burrito',
            cheese: 'cheese',
            more: {
                moar: 'moar!!!!',
            }
        }
    },
    d: {
        null: null,
        undef: undefined,
        emptyObj: {}, // FIXME??? Cant search for empty objects
        emptyArr: [], // FIXME??? Cant search for empty arrays
        function: () => {} // NOTE: Shows up when searching '{}'. 
    }
}; */

// deepItem = 4;

// console.log('thingything', typeof deepItem);
var ds = deepSearch(deepItem, searchTerm);
console.log(ds);
// var dsPath = ds[4].path;
// console.log( path.join(...dsPath) );


function objectCrawler () {}