const { tokenVerification } = require('../utilities/hashing&tokens')

const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(404).json({ err: "Token not found" })
    }
    const verify = tokenVerification(token)
    if(verify === 'invalid signature')
    {
        return res.status(403).json({err:'Invalid signature!'})
    }
    if(verify === 'jwt expired')
        {
            return res.status(403).json({err:'The session is expired!'})
        }
        
    req.user = verify
    next()

}

module.exports = { verifyToken }