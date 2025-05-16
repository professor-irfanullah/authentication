const express = require('express')
const multer = require('../middlewares/multerMiddleware')
const router = express.Router()
const { seekersHandler } = require('../routeHandlers/seekersOnlyRoute')
const { profileHandler } = require('../routeHandlers/profileUploadHandler')
const authorize = require('../middlewares/authorizationMiddleware')
const { verifyToken } = require('../middlewares/verifyTokenMiddleware')



router.post('/api/auth/authorized_seekers_route', verifyToken, authorize(['seeker']), seekersHandler)
router.post('/api/auth/profile/picture', verifyToken, authorize(['seeker']), multer.single('profile'), profileHandler)

module.exports = router