const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middlewares/verifyTokenMiddleware')
const authorize = require('../middlewares/authorizationMiddleware')
const { insertEmployeeProfile } = require('../routeHandlers/employer_profiles/insertEmployeeProfile')
const { fetchProfile } = require('../routeHandlers/employer_profiles/fetchEmployeeProfile')
const { fetchProfilePercentage } = require('../routeHandlers/employer_profiles/fetchEmployeeProfileCompletionStatus')
const { fetchEmployeeAllJobs } = require('../routeHandlers/employer_profiles/fetchAllPostedJobByEmployee')
const { postJob } = require('../routeHandlers/employer_profiles/insertJob')
const { deleteJob } = require('../routeHandlers/employer_profiles/deleteJobPosting')
const { updateJob } = require('../routeHandlers/employer_profiles/updateJobs')
const { fetchData } = require('../routeHandlers/employer_profiles/fetchApplicantDetails')
const { verifyApplication } = require('../routeHandlers/employer_profiles/verifyApplication')
router.use(express.json())

router.post('/insertProfile', verifyToken, authorize(['employee']), insertEmployeeProfile)
router.post('/post/job', verifyToken, authorize(['employee']), postJob)
router.post('/update/job', verifyToken, authorize(['employee']), updateJob)
router.post('/verify/application', verifyToken, authorize(['employee']), verifyApplication)



router.get('/fetchProfile', verifyToken, authorize(['employee']), fetchProfile)
router.get('/fetchProfilePercentage', verifyToken, authorize(['employee']), fetchProfilePercentage)
router.get('/fetchEmployeeAllJobs', verifyToken, authorize(['employee']), fetchEmployeeAllJobs)
router.get('/fetchApplicantsDetail', verifyToken, authorize(['employee']), fetchData)


router.delete('/delete/job', verifyToken, authorize(['employee']), deleteJob)

module.exports = router 