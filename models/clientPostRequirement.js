import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    positionName: { type: String, required: true },
    companyName: { type: String, required: true },
    technicalSkills: { type: String, required: true },
    yearOfExperience: { type: String, required: true },
    numberOfPositions: { type: String, required: true },
    location: { type: String, required: true },
    JD: {
        type: Buffer,
        required: true,
    },
    budget: { type: String, required: true },
    status: { type: String, required: true },
    workerType: { type: String, required: true },
    workMode: { type: String, required: true },
    // applied: [{}]
}, {
    timestamps: true
});

const ClientPostRequirement = mongoose.model('ClientPostRequirement', jobSchema);

export default ClientPostRequirement;
