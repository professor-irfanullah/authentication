const protected = (req, res, next) => {
    const user = req.user
    res.status(200).json({msg:'Welcom back!' , user:user})
}
module.exports = { protected }