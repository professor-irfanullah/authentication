const express = require('express')
const { testHandler } = require('../routeHandlers/testHandler')
const { registerUser } = require('../routeHandlers/registerUser')
const { LoginUser } = require('../routeHandlers/loginUser')
const { protected } = require('../routeHandlers/protected')
const { verifyToken } = require('../middlewares/verifyTokenMiddleware')
const { verifyUserIdentity } = require('../utilities/verifyUserToken')
const { logOut } = require('../routeHandlers/logout')
const { logOutMiddleware } = require('../middlewares/logoutMiddleware')
const authorize = require('../middlewares/authorizationMiddleware')
const multer = require('../middlewares/multerMiddleware')


const { verifyAccountStatus } = require('../routeHandlers/accountStatus')
const { seekersHandler } = require('../routeHandlers/seekersOnlyRoute')
const { profileHandler } = require('../routeHandlers/profileUploadHandler')
const router = express.Router()
router.use(express.json())

router.get('/api/test', testHandler)
router.get('/api/auth/verify', verifyUserIdentity)
router.get('/api/auth/accountStatus', verifyAccountStatus)


router.post('/api/auth/register', registerUser)
router.post('/api/auth/login', LoginUser)
router.post('/api/auth/protected', verifyToken, protected)
router.post('/api/auth/logout', logOutMiddleware, logOut)
router.post('/api/auth/check', verifyToken, authorize(['seeker']), seekersHandler)
router.post('/api/auth/profile/picture', verifyToken, authorize(['seeker']), multer.single('profile'), profileHandler)



module.exports = router