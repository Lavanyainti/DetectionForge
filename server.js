import express from "express"
const app=express();
import cors from "cors"
import dotenv from 'dotenv'

dotenv.config();

import mongoose from "mongoose"
import path from 'path'
import demoRouter from './routes/demoRouter.js'
import authRouter from './routes/authRoute.js'
import cookieParser from "cookie-parser";
import Auth from "./model/authModel.js";

//  app.use(
//    cors({
//      origin: "http://localhost:8080", // nee frontend URL
//      credentials: true,
//    })
//  );

  app.use(cors({
       origin: ["https://detectionforge-client.appwrite.network"], 
       methods: ["GET", "POST", "PUT", "DELETE"],
       credentials: true
    }));
app.use(express.json())
app.use(cookieParser());

const port=process.env.PORT || 5011;

app.listen(port,()=>{
    console.log(`server listening at port ${port}`)
})

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.use('/api',demoRouter)
app.use('/api',authRouter)

mongoose.connect(process.env.DB_URL).then((result)=>{
    console.log("DB connected succesfully")
}).catch((err)=>{
    console.log(err)
})

// const admin = await Auth.findOne({
//   email: process.env.ADMIN_EMAIL,
// });

// if(admin){
//     console.log("admin already existed")
// }

// if (!admin) {
//   await Auth.create({
//     email: "admin@detectionforge.com",
//     password: "Admin@123",
//     role: "admin",
//   });
// }
