var path = require('path');
var deepSearch = require('./deepSearch');
var searchTerm = '4';



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
                funct: ()=>{}
            }
        }
    }
];

deepItem = {
    a: {
        one: 1,
        oneTwo: {
            one: 'one',
            two: 'two'
        }
    },
    b: {
        two: 2,
        arr: [0, 1, 2, 3, 4, 5, 6, [8, 9, 10, [11]]]
    },
    c: {
        food: {
            taco: 'taco',
            burrito: 'burrito',
            cheese: 'cheese',
            more: {
                moar: 'moar!!!!',
                funct: () => {}
            }
        }
    }
};


var ds = deepSearch(searchTerm, deepItem);
console.log(ds);
// var dsPath = ds[4].path;
// console.log( path.join(...dsPath) );


function objectCrawler () {}