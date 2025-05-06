const customErrorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send(err.message)
        return next()
    }
    res.status(500).json(err.message)
}
module.exports = { customErrorHandler }