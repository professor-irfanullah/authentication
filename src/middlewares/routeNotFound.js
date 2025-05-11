const notFound = (req, res, next) => {
    res.status(404).json({ err: "Route not found" })
    next()
}

module.exports = { notFound }