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
const { insertSeekerSkillRecord } = require('../routeHandlers/seekersOnlyHandlers/insertUserSkillInfo')
const { deleteSeekerSkillRecord } = require('../routeHandlers/seekersOnlyHandlers/deleteUserSkillRecord')
const { uploadSeekerCV } = require('../routeHandlers/seekersOnlyHandlers/uploadUserCV')
const { getSeekerData } = require('../routeHandlers/seekersOnlyHandlers/getSeelerInfo')
const { getSeekerSkills } = require('../routeHandlers/seekersOnlyHandlers/getSeekerSkills')
const { deleteEduRecord } = require('../routeHandlers/seekersOnlyHandlers/deleteEducationRecord')
const { getSeekerEducation } = require('../routeHandlers/seekersOnlyHandlers/getUserEducationRecords')
const { getSeekerProfileCompletionPercentage } = require('../routeHandlers/seekersOnlyHandlers/getSeekerProfileCompletionStatus')
const { updateData } = require('../routeHandlers/seekersOnlyHandlers/updateNameAndProfileVisibility')
const { allJobs } = require('../routeHandlers/seekersOnlyHandlers/getAllJobs')
const { submitJobApplication } = require('../routeHandlers/seekersOnlyHandlers/submitJobApplication')
const { getAllAppliedApplications } = require('../routeHandlers/seekersOnlyHandlers/getAllAppliedApplications')




router.post('/authorized_seekers_route', verifyToken, authorize(['seeker']), seekersHandler)
router.post('/profile/picture', verifyToken, authorize(['seeker']), multer.single('profile'), profileHandler)
router.post('/profile/cv', verifyToken, authorize(['seeker']), multer.single('file'), uploadSeekerCV)
router.post('/insert/profile/record', verifyToken, authorize(['seeker']), insertUserProfileInfo)
router.post('/insert/education/record', verifyToken, authorize(['seeker']), insertSeekerEducationInfo)
router.post('/insert/skill/record', verifyToken, authorize(['seeker']), insertSeekerSkillRecord)
router.post('/update/profile/name/visibility', verifyToken, authorize(['seeker']), updateData)
router.post('/insert/job/application', verifyToken, authorize(['seeker']), submitJobApplication)

router.get('/get/education/record', verifyToken, authorize(['seeker']), getSeekerEducation)
router.get('/delete/education/record', verifyToken, authorize(['seeker']), deleteEduRecord)
router.get('/delete/skill/record', verifyToken, authorize(['seeker']), deleteSeekerSkillRecord)
router.get('/profile-info', verifyToken, authorize(['seeker']), getSeekerData)
router.get('/get/skill/record', verifyToken, authorize(['seeker']), getSeekerSkills)
router.get('/get/profile/comp/percentage', verifyToken, authorize(['seeker']), getSeekerProfileCompletionPercentage)
router.get('/get/all/jobs', allJobs)
router.get('/get/seeker/applications', verifyToken, authorize(['seeker']), getAllAppliedApplications)



module.exports = router