import Demo from '../model/bookDemo.js'
import getTransporter from "../utils/sendMail.js";
export const createDemo=async (req,res)=>{
    try{
        const {name,email,company,role,message,source,user_agent}=req.body
        console.log("name: "+name)
        const demo=new Demo({name,email,company,role,message,source,user_agent});
        const result=await demo.save();
        console.log("controllermail: "+process.env.EMAIL_USER)
        console.log("controllerpassword: "+process.env.EMAIL_PASS)
        await getTransporter().sendMail({
            from: process.env.EMAIL_USER,
            to: "lavanyainti04@gmail.com",
            replyTo: email,
            subject: "New Demo Request - Detection Forge",
            html: `
                <h2>New Demo Request</h2>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Company:</b> ${company}</p>
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

