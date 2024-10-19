import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    companyname: { type: String, default: null },
    mobile: { type: String, default: null },
    website: { type: String, default: null },
    role: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    userid:{type:String},
})

const Auth = mongoose.model("Auth", authSchema);
export default Auth;