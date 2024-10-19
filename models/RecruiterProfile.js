// models/RecruiterProfile.js

import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    mobilenumber: { 
        type: String, 
        required: true 
    }
});

const RecruiterProfile = mongoose.model('RecruiterProfile', recruiterProfileSchema);

export default RecruiterProfile;
