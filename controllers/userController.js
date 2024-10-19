import Auth from "../models/authUser.js";
import JobSeekerAuth from "../models/jobseekerAuth.js";
import RecruiterAuth from "../models/recruiterAuth.js";

export const getUserDetails = async (req, res) => {
    try {
        let user = {}
        if(req.user.role == "client") {
            user = await Auth.findOne({ email: req.user.email }, { _id: 0, __v: 0, password: 0 });
        } 
        if(req.user.role == "recruiter") {
            user = await RecruiterAuth.findOne({ email: req.user.email }, { _id: 0, __v: 0, password: 0 });
        }
        if(req.user.role == "jobseeker") {
            user = await JobSeekerAuth.findOne({ email: req.user.email }, { _id: 0, __v: 0, password: 0 });
        }
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            res.status(401).send("Token expired");
        } else {
            res.status(500).send("Internal Server Error");
        }
    }
}


export const getRecruiterDetails = async (req, res) => {
    try {
        const user = await RecruiterAuth.findOne({ email: req.user.email }, { _id: 0, __v: 0, password: 0 });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            res.status(401).send("Token expired");
        } else {
            res.status(500).send("Internal Server Error");
        }
    }
}

export const getJobseekerDetails = async (req, res) => {
    try {
        const user = await JobSeekerAuth.findOne({ email: req.user.email }, { _id: 0, __v: 0, password: 0 });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            res.status(401).send("Token expired");
        } else {
            res.status(500).send("Internal Server Error");
        }
    }
}
