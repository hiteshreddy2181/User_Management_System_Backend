import express from 'express';
import verifyToken from '../middleware/auth.js';
const router = express.Router();
import multer from 'multer';

import {getUserDetails,studentLogin, addStudent, getStudents, UpdateStudent, DeleteStudent } from '../controllers/applicationController.js';


router.post('/login', studentLogin);
router.get('/userdetails', verifyToken, getUserDetails);

router.post('/add-student', addStudent);
router.get('/get-students', getStudents);
router.put('/update-student/:username', UpdateStudent);
router.delete('/delete-student/:username', DeleteStudent);


export default router;