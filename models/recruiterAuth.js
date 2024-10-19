import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: { type: String, default: null },
    mobile: { type: String, default: null },
    role: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    userid:{type:String},
})

const RecruiterAuth = mongoose.model("RecruiterAuth", authSchema);
export default RecruiterAuth;