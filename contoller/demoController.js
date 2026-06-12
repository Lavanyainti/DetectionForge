import Demo from '../model/bookDemo.js'
import getTransporter from "../utils/sendMail.js";
import crypto from "crypto";
import Auth from "../model/authModel.js";
const generatePassword = () => {
  return crypto.randomBytes(8).toString("base64url");
};

export const createDemo=async (req,res)=>{
    try{
        const {firstName,lastName,companyName,companyEmail,phoneNumber,role,location,message,status}=req.body
        console.log("name: "+firstName)
        const demo=new Demo({firstName,lastName,companyName,companyEmail,phoneNumber,role,location,message,status});
        const result=await demo.save();
        console.log("controllermail: "+process.env.EMAIL_USER)
        console.log("controllerpassword: "+process.env.EMAIL_PASS)
        await getTransporter().sendMail({
            from: process.env.EMAIL_USER,
            to: "lavanyainti04@gmail.com",
            replyTo: companyEmail,
            subject: "New Demo Request - Detection Forge",
            html: `
                <h2>New Demo Request</h2>
                <p><b>Name:</b> ${firstName+" "+lastName}</p>
                <p><b>Email:</b> ${companyEmail}</p>
                <p><b>Company:</b> ${companyName}</p>
                <p><b>Role:</b> ${role || "Not provided"}</p>
                <p><b>Message:</b> ${message || "No message"}</p>
            `,
        });
        res.status(200).json({
                message: "Demo created successfully",
                data: result
        });
    }catch(err){
        console.log(err)
        return res.status(400).json({message:"error while creating "+err})
    }
}

export const getAllDemoRequests = async (req, res) => {
  try {
    const requests = await Demo.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
};

// export const approveRequest = async (req, res) => {
//   try {
//     const request = await Demo.findByIdAndUpdate(
//       req.params.id,
//       {
//         status: "approved",
//         approvedAt: new Date(),
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       request,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export const approveRequest = async (req, res) => {
  try {
    const demoRequest = await Demo.findById(req.params.id);

    if (!demoRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 1. generate password
    const plainPassword =  generatePassword();
    // 2. create auth user
    const newUser = new Auth({
      email: demoRequest.companyEmail,
      password: plainPassword,
      role: "user",
      authProvider: "local",
    });

    await newUser.save(); // password auto-hashed by pre-save hook

    // 3. update demo request
    demoRequest.status = "approved";
    demoRequest.approvedAt = new Date();
    await demoRequest.save();

    // 4. send email to user
    await getTransporter().sendMail({
      from: process.env.EMAIL_USER,
      to: demoRequest.companyEmail,
      subject: "Your Account is Approved 🎉",
      html: `
        <h2>Welcome ${demoRequest.firstName}!</h2>
        <p>Your demo request has been approved.</p>
        <p><b>Login Credentials:</b></p>
        <p>Email: ${demoRequest.companyEmail}</p>
        <p>Password: ${plainPassword}</p>
        <br/>
        <p>Please change your password after first login.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Approved + user created + email sent",
      user: newUser,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const request = await Demo.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectedAt: new Date(),
      },
      { new: true }
    );

    await getTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to: request.companyEmail,
    subject: "Demo Request Update",
    html: `
        <h3>Request Update</h3>
        <p>Sorry, unfortunately your demo request was not approved.</p>
    `,
    });

    res.status(200).json({
      success: true,
      request,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};