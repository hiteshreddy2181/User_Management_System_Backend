// controllers/clientProfileController.js

import ClientProfile from '../models/ClientProfile.js';
import Joi from 'joi';

const clientProfileSchema = Joi.object({
    companyname: Joi.string().min(2).required().messages({
        'string.base': 'Company name should be a type of string',
        'string.min': 'Company name must be at least 2 characters long',
        'any.required': 'Company name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required'
    }),
    mobilenumber: Joi.string().min(10).max(15).required().messages({
        'string.min': 'Mobile number must be at least 10 characters long',
        'string.max': 'Mobile number can be at most 15 characters long',
        'any.required': 'Mobile number is required'
    }),
    website: Joi.string().pattern(new RegExp(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)).required().messages({
        'string.pattern.base': 'Website is invalid',
        'any.required': 'Website is required'
    })
});

export const getAllClientProfiles = async (req, res) => {
    try {
        const clientProfiles = await ClientProfile.find();
        res.status(200).json(clientProfiles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addClientProfile = async (req, res) => {
    const { error } = clientProfileSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const { companyname, email, mobilenumber, website } = req.body;

    const newClientProfile = new ClientProfile({
        companyname,
        email,
        mobilenumber,
        website
    });

    try {
        const savedClientProfile = await newClientProfile.save();
        res.status(201).json(savedClientProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateClientProfile = async (req, res) => {
    const { id } = req.params;
    const { error } = clientProfileSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const { companyname, email, mobilenumber, website } = req.body;

    try {
        const updatedClientProfile = await ClientProfile.findByIdAndUpdate(
            id,
            { companyname, email, mobilenumber, website },
            { new: true, runValidators: true }
        );

        if (!updatedClientProfile) {
            return res.status(404).json({ message: 'Client Profile not found' });
        }

        res.status(200).json(updatedClientProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
