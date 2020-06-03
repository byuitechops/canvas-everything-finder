const objectCrawler = require('./objectCrawler.js');

let path = [
    "hi",
    3
];

let obj = {
    hi: [
        "how",
        "are",
        "you?",
        {
            there: "friend!",
            meep: {
                beep: "boop",
                heep: "hoop",
                seep: "soop",
            }
        }
    ]
}

console.log(objectCrawler(obj, path))