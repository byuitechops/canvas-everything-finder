module.exports = function objectCrawler (object, path) {
    function crawl (acc, step) {
        return acc[step];
    }

    if (!Array.isArray(path))
        throw "objectCrawler path input must be an array!"
    return path.reduce(crawl, object)
}