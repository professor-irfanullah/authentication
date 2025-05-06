const logOut = async (req, res, next) => {
    res.status(200).json({ msg: "Operation successful" })
}
module.exports = { logOut }