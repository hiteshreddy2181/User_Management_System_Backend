// controllers/recruiterProfileController.js

import RecruiterProfile from '../models/RecruiterProfile.js';
import Joi from 'joi';

const recruiterProfileSchema = Joi.object({
    name: Joi.string().min(2).required().messages({
        'string.base': 'Name should be a type of string',
        'string.min': 'Name must be at least 2 characters long',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required'
    }),
    mobilenumber: Joi.string().min(10).max(15).required().messages({
        'string.min': 'Mobile number must be at least 10 characters long',
        'string.max': 'Mobile number can be at most 15 characters long',
        'any.required': 'Mobile number is required'
    })
});

export const getAllRecruiterProfiles = async (req, res) => {
    try {
        const recruiterProfiles = await RecruiterProfile.find();
        res.status(200).json(recruiterProfiles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addRecruiterProfile = async (req, res) => {
    const { error } = recruiterProfileSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const { name, email, mobilenumber } = req.body;

    const newRecruiterProfile = new RecruiterProfile({
        name,
        email,
        mobilenumber
    });

    try {
        const savedRecruiterProfile = await newRecruiterProfile.save();
        res.status(201).json(savedRecruiterProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateRecruiterProfile = async (req, res) => {
    const { id } = req.params;
    const { error } = recruiterProfileSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const { name, email, mobilenumber } = req.body;

    try {
        const updatedRecruiterProfile = await RecruiterProfile.findByIdAndUpdate(
            id,
            { name, email, mobilenumber },
            { new: true, runValidators: true }
        );

        if (!updatedRecruiterProfile) {
            return res.status(404).json({ message: 'Recruiter Profile not found' });
        }

        res.status(200).json(updatedRecruiterProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
