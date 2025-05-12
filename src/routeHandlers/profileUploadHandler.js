const profileHandler = async (req, res, next) => {

    res.send(req.file)
}
module.exports = { profileHandler }