import mongoose from "mongoose";

const demoScheema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
            type:String,
            required:true
    },
    company:{
            type:String,
            required:true   
    },
    role:{
            type:String,
            required:true   
    },
    message:{
            type:String,
    },
    source:{
            type:String,
    },
    user_agent:{
            type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
     
})

export default mongoose.model("Demo",demoScheema)