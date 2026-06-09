import express from 'express'
import { createDemo } from '../contoller/demoController.js';
import { emailLogin } from '../contoller/authController.js';

const router=express.Router();

router.post('/createDemo',createDemo)
router.post('/mailLogin',emailLogin)
export default router;