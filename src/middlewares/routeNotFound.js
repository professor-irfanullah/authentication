const notFound = (req, res, next) => {
    res.json({ err: "Route not found" })
    next()
}

module.exports = { notFound }