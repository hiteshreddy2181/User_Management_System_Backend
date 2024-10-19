import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  techskills: { type: String, required: true },
  location: { type: String, required: true },
  positionApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPostRequirement', required: true },
  positionName: { type: String, required: true },
  screeningStatus: { type: String, required: true, default: 'Pending' },
  round1: { type: String, default: 'Not Started' },
  round2: { type: String, default: 'Not Started' },
  round3: { type: String, default: 'Not Started' },
  comments: { type: String },
  resume: { type: Buffer, required: true },
  status: { type: String, required: true, default: 'Applied' },
  workerType: { type: String, required: true },
  workMode: { type: String, required: true },
  chatInitiated:{type:Boolean,required:true},
  roomID:{type:String},
}, {
  timestamps: true
});

const ApplicationSchema = mongoose.model('ApplicationSchema', applicationSchema);

export default ApplicationSchema;
