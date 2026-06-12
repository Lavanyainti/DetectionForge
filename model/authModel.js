import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },resetPasswordToken: {
    type: String,
    default: null
},
resetPasswordExpires: {
    type: Date,
    default: null
},
     
})

authSchema.pre("save", async function () {
    if (!this.password) {
        return;
    }

    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

authSchema.methods.comparePassword=async function(password){
        //Here, comparePassword is attached to userSchema.methods, meaning it is an instance method.
        // This means you can only call it on a specific user document (an instance of the model), not on the User model itself.
    return bcrypt.compare(password,this.password)
}

export default mongoose.model("Auth",authSchema)