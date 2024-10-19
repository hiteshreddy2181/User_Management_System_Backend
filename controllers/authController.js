import Auth from "../models/authUser.js"
import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import ClientPostRequirement from "../models/clientPostRequirement.js";

import { v4 as uuidv4 } from 'uuid';
const TOKEN = "Arun@123";

export const clientRegister = async (req, res) => {
    try {
        const { companyname, mobile, website, email, password, role } = req.body;
        if (!(email && password && companyname && mobile, role)) {
            res.status(400).send("details are required");
        }

        const oldUser = await Auth.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User already exist. please login");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        
        const user = await Auth.create({
            companyname,
            mobile,
            website,
            role,
            email: email.toLowerCase(),
            password: encryptedPassword,
            userid: uuidv4(), // Generate unique user ID
        });

        const token = Jwt.sign(
            { user_id: user._id, email },
            TOKEN,
            { expiresIn: "1h" }
        );

        user.token = token;
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
    }
}

export const clientLogin = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!(email && password && role)) {
            res.status(400).send("email and password and role is required");
        }

        const user = await Auth.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = Jwt.sign(
                { user_id: user._id, email, role: user.role },
                TOKEN,
                {
                    expiresIn: "1h"
                }
            )

            user.token = token;
            res.status(200).json(user);
        }
        res.status(400).send("Invalid credentials");
    } catch (error) {
        console.log(error);
    }
}

export const clientPostRequirementController = async (req, res) => {
    try {
        const {
            positionName,
            companyName,
            technicalSkills,
            yearOfExperience,
            numberOfPositions,
            location,
            budget,
            status,
            workerType,
            workMode
        } = req.body;
        const documentData = req.file.buffer;
        const pdfFile = req.file;

        if (!pdfFile) {
            return res.status(400).json({ message: 'Job Description PDF is required' });
        }

        const newPostRequirement = new ClientPostRequirement({
            positionName,
            companyName,
            technicalSkills,
            yearOfExperience,
            numberOfPositions,
            location,
            JD: documentData,
            budget,
            status,
            workerType,
            workMode
        });

        await newPostRequirement.save();

        res.status(201).json({
            message: 'Job created successfully',
            newPostRequirement
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getJobRequirementController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the job requirement by ID
        const jobRequirement = await ClientPostRequirement.findById(id);

        if (!jobRequirement) {
            return res.status(404).json({ message: 'Job requirement not found' });
        }

        res.status(200).json({
            positionName: jobRequirement.positionName,
            companyName: jobRequirement.companyName,
            technicalSkills: jobRequirement.technicalSkills,
            yearOfExperience: jobRequirement.yearOfExperience,
            numberOfPositions: jobRequirement.numberOfPositions,
            location: jobRequirement.location,
            JD: jobRequirement.JD,  // Assuming `jdText` is the field that contains the PDF text
            budget: jobRequirement.budget,
            status: jobRequirement.status
        });
    } catch (error) {
        console.error('Error retrieving job requirement:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getAllJobRequirementsController = async (req, res) => {
    try {
        // Find all job requirements
        const jobRequirements = await ClientPostRequirement.find({}, { __v: 0 }); // Exclude `__v` field

        // Transform the job requirements to include `id` instead of `_id`
        const transformedRequirements = jobRequirements.map(job => {
            return {
                id: job._id.toString(), // Convert ObjectId to string
                positionName: job.positionName,
                companyName: job.companyName,
                technicalSkills: job.technicalSkills,
                yearOfExperience: job.yearOfExperience,
                numberOfPositions: job.numberOfPositions,
                location: job.location,
                JD: job.JD,
                budget: job.budget,
                status: job.status,
                workMode: job.workMode,
                workerType: job.workerType
            };
        });

        res.status(200).json(transformedRequirements);
    } catch (error) {
        console.error('Error retrieving job requirements:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getAllPositionNames = async (req, res) => {
    try {
        const jobs = await ClientPostRequirement.find({}, 'positionName _id');
        
        // Transform the result to rename _id to id
        const result = jobs.map(job => ({
            id: job._id,
            positionName: job.positionName
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching position names', error);
        res.status(500).json({ error: 'Failed to fetch position names' });
    }
};


export const updateJobRequirementController = async (req, res) => {
    try {
        const { id } = req.params;

        const jobRequirement = await ClientPostRequirement.findById(id);
        if (!jobRequirement) {
            return res.status(404).json({ message: 'Job requirement not found' });
        }

        const {
            positionName,
            companyName,
            technicalSkills,
            yearOfExperience,
            numberOfPositions,
            location,
            budget,
            status,
            workerType,
            workMode,
        } = req.body;

        jobRequirement.positionName = positionName || jobRequirement.positionName;
        jobRequirement.companyName = companyName || jobRequirement.companyName;
        jobRequirement.technicalSkills = technicalSkills || jobRequirement.technicalSkills;
        jobRequirement.yearOfExperience = yearOfExperience || jobRequirement.yearOfExperience;
        jobRequirement.numberOfPositions = numberOfPositions || jobRequirement.numberOfPositions;
        jobRequirement.location = location || jobRequirement.location;
        jobRequirement.budget = budget || jobRequirement.budget;
        jobRequirement.status = status || jobRequirement.status;
        jobRequirement.workerType = workerType || jobRequirement.workerType;
        jobRequirement.workMode = workMode || jobRequirement.workMode;
        const pdfFile = req.file;
        if (pdfFile) {
            jobRequirement.JD = pdfFile.buffer; // Update the file buffer
        }


        // Save updated job requirement
        await jobRequirement.save();

        res.status(200).json({
            message: 'Job requirement updated successfully',
            jobRequirement
        });
    } catch (error) {
        console.error('Error updating job requirement:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const deleteJobRequirementController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the job requirement by ID and delete it
        const deletedJob = await ClientPostRequirement.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Job requirement not found' });
        }

        res.status(200).json({ message: 'Job requirement deleted successfully' });
    } catch (error) {
        console.error('Error deleting job requirement:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}