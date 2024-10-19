import mongoose from "mongoose";

const recruiterApplicationSchema = new mongoose.Schema({
    clientPostRequirement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientPostRequirement',
        required: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    technicalSkills: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    yearOfExperience: { type: String, required: true },
    workerType: { type: String, required: true, ref: 'ClientPostRequirement', },
    workMode: { type: String, required: true, ref: 'ClientPostRequirement', },
    resume: {
        type: Buffer,
        required: true
    },
    applicationStatus: { type: String, default: 'pending' },
}, {
    timestamps: true
});

const RecruiterApplication = mongoose.model('RecruiterApplication', recruiterApplicationSchema);

export default RecruiterApplication;
