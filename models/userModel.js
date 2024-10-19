import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {type: String, default: null},
    lastname: {type: String, default: null},
    age: {type: Number, default: null},
    city: {type:String, default: null},
    mobile: {type: Number}
})

const User = mongoose.model("User", userSchema);
export default User;