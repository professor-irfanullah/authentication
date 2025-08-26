const express = require('express')
const { testHandler } = require('../routeHandlers/testHandler')
const { registerUser } = require('../routeHandlers/registerUser')
const { LoginUser } = require('../routeHandlers/loginUser')
const { protected } = require('../routeHandlers/protected')
const { verifyToken } = require('../middlewares/verifyTokenMiddleware')
const { verifyUserIdentity } = require('../utilities/verifyUserToken')
const { logOut } = require('../routeHandlers/logout')
const { logOutMiddleware } = require('../middlewares/logoutMiddleware')
const { verifyAccountStatus } = require('../routeHandlers/accountStatus')
const { changePassword } = require('../routeHandlers/seekersOnlyHandlers/changePassword')
const authorize = require('../middlewares/authorizationMiddleware')
const { verifyAccount } = require('../routeHandlers/verifyAccount')
const { sendEmailForAccountVerification } = require('../routeHandlers/sendAccoundVerificationEmail')



const router = express.Router()
router.use(express.json())

router.get('/api/test', testHandler)
router.get('/verify', verifyUserIdentity)
router.get('/accountStatus', verifyAccountStatus)
router.get('/email/user', sendEmailForAccountVerification)


router.post('/register', registerUser)
router.post('/login', LoginUser)
router.post('/protected', verifyToken, protected)
router.post('/logout', logOutMiddleware, logOut)
router.post('/change/password', verifyToken, authorize(['seeker', 'employee']), changePassword)
router.post('/verify/user', verifyAccount)






module.exports = router