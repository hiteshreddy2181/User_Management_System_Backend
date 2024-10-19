// models/ClientProfile.js

import mongoose from 'mongoose';

const clientProfileSchema = new mongoose.Schema({
    companyname: { type: String, required: true },
    email: { type: String, required: true },
    mobilenumber: { type: String, required: true },
    website: { type: String, required: true }
});

const ClientProfile = mongoose.model('ClientProfile', clientProfileSchema);

export default ClientProfile;
