// models/Requirements.js

import mongoose from 'mongoose';

const requirementsSchema = new mongoose.Schema({
    job_title: { type: String, required: true },
    company_name: { type: String, required: true },
    technical_skills: { type: [String], required: true },
    experience: { type: Number, required: true },
    no_of_positions: { type: Number, required: true },
    location: { type: String, required: true },
    jd: { type: String, required: true },
    budget: { type: Number, required: true },
    status: { type: String, required: true },
    posted_by: { type: String, required: true },
    posted_on: { type: Date, required: true }
});

const Requirements = mongoose.model('Requirements', requirementsSchema);

export default Requirements;
