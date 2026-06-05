import express from "express"
const app=express();
import cors from "cors"
import dotenv from 'dotenv'

dotenv.config();

import mongoose from "mongoose"
import path from 'path'
import demoRouter from './routes/demoRouter.js'

//app.use(cors())

app.use(cors({
     origin: ["https://detectionforge-client.appwrite.network"], 
     methods: ["GET", "POST", "PUT", "DELETE"],
     credentials: true
   }));
app.use(express.json())

const port=process.env.PORT || 5011;

app.listen(port,()=>{
    console.log(`server listening at port ${port}`)
})

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.use('/api',demoRouter)
// app.use('/api',testRouter)

mongoose.connect(process.env.DB_URL).then((result)=>{
    console.log("DB connected succesfully")
}).catch((err)=>{
    console.log(err)
})