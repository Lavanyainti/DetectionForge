import express from 'express'
import { authController, emailLogin, forgotPassword, loginMail, logout, resetPassword } from '../contoller/authController.js';
const router=express.Router();

router.post('/authGoogle',authController)
router.post('/authMail',emailLogin)
router.post('/loginMail',loginMail)
router.post('/logout',logout)
router.post("/forgot-password", forgotPassword);
router.patch(
  "/reset-password/:token",
  resetPassword
);
export default router