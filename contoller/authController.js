import Auth from '../model/authModel.js'
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

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