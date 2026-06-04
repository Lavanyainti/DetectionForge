import express from "express"
import cors from "cors"
import dotenv from 'dotenv'

dotenv.config();

import mongoose from "mongoose"
import path from 'path'
import demoRouter from './routes/demoRouter.js'

const app=express();

app.use(cors())
app.use(express.json())

const port=process.env.PORT || 5011;

app.listen(port,()=>{
    console.log(`server listening at port ${port}`)
})

app.use('/api',demoRouter)
// app.use('/api',testRouter)

mongoose.connect(process.env.DB_URL).then((result)=>{
    console.log("DB connected succesfully")
}).catch((err)=>{
    console.log(err)
})