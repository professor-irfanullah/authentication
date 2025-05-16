const express = require('express')
const multer = require('../middlewares/multerMiddleware')



const router = express.Router()
router.use(express.json())

const { seekersHandler } = require('../routeHandlers/seekersOnlyRoute')
const { profileHandler } = require('../routeHandlers/profileUploadHandler')
const authorize = require('../middlewares/authorizationMiddleware')
const { verifyToken } = require('../middlewares/verifyTokenMiddleware')
const { insertUserProfileInfo } = require('../routeHandlers/seekersOnlyHandlers/insertUserProfileInfo')
const { insertSeekerEducationInfo } = require('../routeHandlers/seekersOnlyHandlers/insertUserEducationInfo')




router.post('/api/auth/authorized_seekers_route', verifyToken, authorize(['seeker']), seekersHandler)
router.post('/api/auth/profile/picture', verifyToken, authorize(['seeker']), multer.single('profile'), profileHandler)
router.post('/insert/profile/record', verifyToken, authorize(['seeker']), insertUserProfileInfo)
router.post('/insert/education/record', verifyToken, authorize(['seeker']), insertSeekerEducationInfo)

module.exports = router