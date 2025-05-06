const customErrorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).json({ err: err.message })
        return next()
    }
    res.status(500).json({ err: err.message })
}
module.exports = { customErrorHandler }