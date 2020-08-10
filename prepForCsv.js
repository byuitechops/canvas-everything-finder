const fs = require('fs'),
      path = require('path'),
      d3 = require('d3-dsv');
const settings = require('./settings');

(function JsonToCsv() {
    var jsonReports = [
        './reports/spring-2020.json',
        './reports/winter-2020.json'
    ];

    jsonReports.map(filePath => {
        let matches = JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf-8'));
        return {
            csvData: settings.prepResultsForCSV(matches),
            filePath: filePath.replace('.json', '.csv')
        };
    }).forEach(report => {
        fs.writeFileSync(report.filePath, d3.csvFormat(report.csvData), 'utf-8');
    });
})()