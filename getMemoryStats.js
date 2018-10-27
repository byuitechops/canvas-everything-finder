module.exports = getMemoryStats;
function getMemoryStats() {
    let memoryInBits = process.memoryUsage();
    let memoryInMegabytes = Object.keys(memoryInBits).reduce((acc, key) => {
        acc[key] = memoryInBits[key] / 1024 / 1024;
        delete memoryInBits[key];
        return acc;
    }, {});
    getMemoryStats.counter++;
    console.log();
    Object.keys(memoryInMegabytes).forEach(key => {
        console.log(`${getMemoryStats.counter}_${ key.padEnd(9) } ${ Number.parseFloat(memoryInMegabytes[key]).toFixed(2).padStart(10) } MB`);
    });
    console.log();

}
getMemoryStats.counter = 0;