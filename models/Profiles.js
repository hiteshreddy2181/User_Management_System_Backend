// models/Profiles.js

import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    candidate_name: { type: String, required: true },
    technical_skills: { type: [String], required: true },
    experience: { type: Number, required: true },
    location: { type: String, required: true },
    resume: { type: String, required: true },
    profile_applied: { type: String, required: true },
    interview_status: { type: String, required: true },
    comments: { type: String, required: true },
    status: { type: String, required: true },
    posted_by: { type: String, required: true },
    posted_on: { type: Date, required: true }
});

const Profiles = mongoose.model('Profiles', profileSchema);

export default Profiles;
