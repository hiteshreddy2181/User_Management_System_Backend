// controllers/requirementsController.js

import Requirements from '../models/Requirements.js';
import Joi from 'joi';

const requirementsSchema = Joi.object({
    job_title: Joi.string().required().messages({
        'any.required': 'Job title is required'
    }),
    company_name: Joi.string().required().messages({
        'any.required': 'Company name is required'
    }),
    technical_skills: Joi.array().items(Joi.string()).required().messages({
        'any.required': 'Technical skills are required'
    }),
    experience: Joi.number().required().messages({
        'any.required': 'Experience is required'
    }),
    no_of_positions: Joi.number().required().messages({
        'any.required': 'Number of positions is required'
    }),
    location: Joi.string().required().messages({
        'any.required': 'Location is required'
    }),
    jd: Joi.string().required().messages({
        'any.required': 'Job description is required'
    }),
    budget: Joi.number().required().messages({
        'any.required': 'Budget is required'
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

export const getAllRequirements = async (req, res) => {
    try {
        const requirements = await Requirements.find();
        res.status(200).json(requirements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addRequirements = async (req, res) => {
    const { error } = requirementsSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const {
        job_title, company_name, technical_skills, experience, no_of_positions, location, jd, budget, status, posted_by, posted_on
    } = req.body;

    const newRequirements = new Requirements({
        job_title,
        company_name,
        technical_skills,
        experience,
        no_of_positions,
        location,
        jd,
        budget,
        status,
        posted_by,
        posted_on
    });

    try {
        const savedRequirements = await newRequirements.save();
        res.status(201).json(savedRequirements);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateRequirements = async (req, res) => {
    const { id } = req.params;
    const { error } = requirementsSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const {
        job_title, company_name, technical_skills, experience, no_of_positions, location, jd, budget, status, posted_by, posted_on
    } = req.body;

    try {
        const updatedRequirements = await Requirements.findByIdAndUpdate(
            id,
            { job_title, company_name, technical_skills, experience, no_of_positions, location, jd, budget, status, posted_by, posted_on },
            { new: true, runValidators: true }
        );

        if (!updatedRequirements) {
            return res.status(404).json({ message: 'Requirements not found' });
        }

        res.status(200).json(updatedRequirements);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
