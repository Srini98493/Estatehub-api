const convertNullStrings = (req, res, next) => {
    for (const key in req.query) {
        if (req.query[key] === 'null') {
            req.query[key] = null;
        }
    }
    next();
};

module.exports = {
    convertNullStrings
}