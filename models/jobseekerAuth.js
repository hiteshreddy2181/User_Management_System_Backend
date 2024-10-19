
import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    mobile: { type: String, default: null },
    role: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    userid:{type:String}
})

const JobSeekerAuth = mongoose.model("JobSeekerAuth", authSchema);
export default JobSeekerAuth;