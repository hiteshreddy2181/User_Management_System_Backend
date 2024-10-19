import express from 'express';
import { clientLogin, clientPostRequirementController, clientRegister, deleteJobRequirementController, getAllJobRequirementsController, getAllPositionNames, getJobRequirementController, updateJobRequirementController } from '../controllers/authController.js';
import { getJobseekerDetails, getRecruiterDetails, getUserDetails } from '../controllers/userController.js';
import { recruiterLogin, recruiterRegister } from '../controllers/recruiterController.js';
import verifyToken from '../middleware/auth.js';
const router = express.Router();
import multer from 'multer';
import { ApplicationBulkUpload, ClientBulkUpload } from '../controllers/BulkUpload.js';
import { applyForJobController, getApplication, getSingleApplication, recruiterApplicationUpdate, recruiterDeleteApplication, updateChatInitiated } from '../controllers/applicationController.js';
import { jobseekerLogin, jobseekerRegister } from '../controllers/jobseekerController.js';


router.post('/client/register', clientRegister);
router.post('/client/login', clientLogin);
router.get('/userdetails', verifyToken, getUserDetails);

router.post('/recruiter/register', recruiterRegister);
router.post('/recruiter/login', recruiterLogin);
router.get('/recruiterdetails', verifyToken, getRecruiterDetails);

router.post('/jobseeker/register', jobseekerRegister);
router.post('/jobseeker/login', jobseekerLogin);
router.get('/jobseekerdetails', verifyToken, getJobseekerDetails);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/post-job', upload.single('JD'), clientPostRequirementController);

router.get('/get-job/:id', getJobRequirementController);
router.get('/get-jobs', getAllJobRequirementsController);
router.put('/update-job/:id', upload.single('JD'), updateJobRequirementController);
router.delete('/delete-job/:id', deleteJobRequirementController);

router.post('/recruiter-apply', upload.single('resume'), applyForJobController);
router.get('/get-applications', getApplication);
router.get('/get-single-applications', getSingleApplication);
router.put('/update-application/:id', upload.single('resume'), recruiterApplicationUpdate);
router.delete('/delete-application/:id', recruiterDeleteApplication);
router.get('/get-allpositions', getAllPositionNames);


router.post('/client-bulk-upload', upload.any(), ClientBulkUpload)
router.post('/application-bulk-upload', upload.any(), ApplicationBulkUpload)

router.post('/updateChatInitiated',updateChatInitiated);

export default router;