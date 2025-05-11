const profileHandler = async (req, res, next) => {
    console.log('this route', req.user);

    res.send(req.file)
}
module.exports = { profileHandler }