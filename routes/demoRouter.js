import express from 'express'
import { createDemo } from '../contoller/demoController.js';

const router=express.Router();

router.post('/createDemo',createDemo)
export default router;