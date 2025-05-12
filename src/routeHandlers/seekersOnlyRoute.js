const seekersHandler = async (req, res, next) => {
    res.status(200).json({ msg: 'Welcome back!', user: req.user })
}
module.exports = { seekersHandler }