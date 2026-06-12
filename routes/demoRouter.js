import express from 'express'
import { approveRequest, createDemo, getAllDemoRequests, rejectRequest } from '../contoller/demoController.js';
import { emailLogin } from '../contoller/authController.js';

const router=express.Router();

router.post('/createDemo',createDemo)
router.post('/mailLogin',emailLogin)
router.get("/allDemoRequests", getAllDemoRequests);
router.patch("/demoRequests/:id/approve", approveRequest);
router.patch("/demoRequests/:id/reject", rejectRequest);
export default router;