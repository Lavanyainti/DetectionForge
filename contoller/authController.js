import Auth from '../model/authModel.js'
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import getTransporter from "../utils/sendMail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authController = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await Auth.findOne({
      email: payload.email,
    });

    if (!user) {
      user = await Auth.create({
        email: payload.email,
        authProvider: "google",
      });
    }

    console.log(payload);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const jwtToken = jwt.sign(
              {
                id: user._id,
                email: user.email,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );
            console.log(jwtToken)
            res.cookie("token", jwtToken, {
              httpOnly: true,
              secure: false, // localhost kabatti false
              sameSite: "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return res.status(200).json({
              success: true,
              user,
              expiresAt,
            });

  } catch (error) {
    console.log(error);

   return res.status(200).json({
  success: true,
  token: jwtToken,
  user,
});
  }
};

export const emailLogin=async(req,res)=>{
  try{
    const {email,password}=req.body
  const existingUser=await Auth.findOne({email:email})
  if(existingUser){
    return res.status(400).json({message:"User already existed"})
  }

  const newUser=new Auth({email,password,authProvider:"local"})
  const response=newUser.save();
  return res.status(200).json({
          success: true,
          newUser,
        });

  }catch(err){
    console.log(err)
     return res.status(500).json({
      success: false,
      message: "Mail Authentication Failed",
    });
  }
}

export const loginMail=async(req,res)=>{
    try{
        let {email,password}=req.body;
        const userLogin=await Auth.findOne({email});
        if(!userLogin){
            return res.status(500).json({message:"User not found"})
        }
        const isVlidPassword=await userLogin.comparePassword(password);
            // userLogin is the result of await User.findOne({ email }).

            // userLogin is a document (an instance of the User model).

            // That document has the comparePassword method available because it’s part of the schema’s methods.
        if(!isVlidPassword){
            return res.status(400).json({message:"Password must be same"});
        }
        console.log(isVlidPassword)
        let payload={id:userLogin._id}
        console.log("payload",payload)
        console.log(process.env.JWT_SECRETKEY)
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const jwtToken = jwt.sign(
          {
            id: userLogin._id,
            email: userLogin.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        console.log(jwtToken)
          res.cookie("token", jwtToken, {
          httpOnly: true,
          secure: false, // localhost kabatti false
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        let finalData={
            id:userLogin._id,
            email:userLogin.email,
            role:userLogin.role,
            expiresAt:expiresAt,
        }
        console.log(finalData)
        return res.status(200).json({message:"Login success", data:finalData})
    }catch(err){
        console.log(err.response?.data);
        console.log(err);
        return res.status(500).json({message:"Error during login "+err})
    }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink =
      `https://detectionforge-client.appwrite.network/resetPassword/${token}`;

    await getTransporter().sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>

        <p>Click the button below to reset your password:</p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Reset link sent to your email",
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await Auth.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = newPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};