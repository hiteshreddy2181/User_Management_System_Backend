// controllers/profilesController.js

import Profiles from '../models/Profiles.js';
import Joi from 'joi';

const profileValidationSchema = Joi.object({
    candidate_name: Joi.string().required().messages({
        'any.required': 'Candidate name is required'
    }),
    technical_skills: Joi.array().items(Joi.string()).required().messages({
        'any.required': 'Technical skills are required'
    }),
    experience: Joi.number().required().messages({
        'any.required': 'Experience is required'
    }),
    location: Joi.string().required().messages({
        'any.required': 'Location is required'
    }),
    resume: Joi.string().required().messages({
        'any.required': 'Resume is required'
    }),
    profile_applied: Joi.string().required().messages({
        'any.required': 'Profile applied is required'
    }),
    interview_status: Joi.string().required().messages({
        'any.required': 'Interview status is required'
    }),
    comments: Joi.string().required().messages({
        'any.required': 'Comments are required'
    }),
    status: Joi.string().required().messages({
        'any.required': 'Status is required'
    }),
    posted_by: Joi.string().required().messages({
        'any.required': 'Posted by is required'
    }),
    posted_on: Joi.date().required().messages({
        'any.required': 'Posted on is required'
    })
});

export const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profiles.find();
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addProfile = async (req, res) => {
    const { error } = profileValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const {
        candidate_name, technical_skills, experience, location, resume, profile_applied, interview_status, comments, status, posted_by, posted_on
    } = req.body;

    const newProfile = new Profiles({
        candidate_name,
        technical_skills,
        experience,
        location,
        resume,
        profile_applied,
        interview_status,
        comments,
        status,
        posted_by,
        posted_on
    });

    try {
        const savedProfile = await newProfile.save();
        res.status(201).json(savedProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { error } = profileValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const {
        candidate_name, technical_skills, experience, location, resume, profile_applied, interview_status, comments, status, posted_by, posted_on
    } = req.body;

    try {
        const updatedProfile = await Profiles.findByIdAndUpdate(
            id,
            { candidate_name, technical_skills, experience, location, resume, profile_applied, interview_status, comments, status, posted_by, posted_on },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(updatedProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
