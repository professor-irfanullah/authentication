const logOutMiddleware = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(404).json({ err: "Unable to perform this action" })
    }
    res.clearCookie('token')
    next()
}
module.exports = { logOutMiddleware }