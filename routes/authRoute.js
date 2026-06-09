import express from 'express'
import { authController, emailLogin, loginMail, logout } from '../contoller/authController.js';
const router=express.Router();

router.post('/authGoogle',authController)
router.post('/authMail',emailLogin)
router.post('/loginMail',loginMail)
router.post('/logout',logout)
export default router