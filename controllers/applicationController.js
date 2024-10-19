import ApplicationSchema from "../models/applicationSchema.js";
import ClientPostRequirement from "../models/clientPostRequirement.js";

export const updateChatInitiated = async (req, res) => {
    const { applicationId, roomID } = req.body;
  console.log(req.body)
    if (!applicationId || !roomID) {
      return res.status(400).json({ message: 'Application ID and Room ID are required' });
    }
  
    try {
      const application = await ApplicationSchema.findByIdAndUpdate(
        applicationId,
        { chatInitiated: true, roomID: roomID }, // Update both chatInitiated and roomId
        { new: true } // Return the updated document
      );
  
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      res.status(200).json(application);
    } catch (error) {
      console.error('Error updating chatInitiated and roomId:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

export const applyForJobController = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            technicalSkills,
            location,
            email,
            yearOfExperience,
            positionId
        } = req.body;
        const resume = req.file.buffer;

        if (!resume) {
            return res.status(400).json({ message: 'Resume PDF is required' });
        }

        const jobRequirement = await ClientPostRequirement.findById(positionId);
        if (!jobRequirement) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const newApplication = new ApplicationSchema({
            firstName: firstName,
            lastName: lastName,
            email: email,
            yearsOfExperience: yearOfExperience,
            techskills: technicalSkills,
            location,
            positionApplied: positionId,
            positionName: jobRequirement.positionName,
            screeningStatus: 'Pending',
            resume,
            status: 'Applied',
            workerType: jobRequirement.workerType,
            workMode: jobRequirement.workMode,
            chatInitiated:false,
            roomID:'',
        });

        await newApplication.save();

        res.status(201).json({
            message: 'Application submitted successfully',
            newApplication
        });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const getApplication = async (req, res) => {
    try {
        const applications = await ApplicationSchema.find({}, { __v: 0 });
        const transformedRequirements = applications.map(data => {
            return {
                id: data._id.toString(),
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                yearsOfExperience: data.yearsOfExperience,
                techskills: data.techskills,
                location: data.location,
                positionApplied: data.positionApplied,
                positionName: data.positionName,
                screeningStatus: data.screeningStatus,
                round1: data.round1,
                round2: data.round2,
                round3: data.round3,
                comments: data.comments,
                resume: data.resume,
                status: data.status,
                workerType: data.workerType,
                workMode: data.workMode,
                chatInitiated: data.chatInitiated,
                roomID:data.roomID,
            };
        });
        res.status(200).json(transformedRequirements);
    } catch (error) {
        res.status(500).send(error);
    }
}

export const recruiterApplicationUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const applicationData = await ApplicationSchema.findById(id);
        if (!applicationData) {
            return res.status(404).json({ message: 'Job requirement not found' });
        }

        const {
            firstName,
            lastName,
            yearsOfExperience,
            techskills,
            location,
            positionApplied,
            positionName,
            screeningStatus,
            round1,
            round2,
            round3,
            comments,
            email,
            status,
            workerType,
            workMode,
        } = req.body;

        applicationData.firstName = firstName || applicationData.firstName;
        applicationData.lastName = lastName || applicationData.lastName;
        applicationData.yearsOfExperience = yearsOfExperience || applicationData.yearsOfExperience;
        applicationData.techskills = techskills || applicationData.techskills;
        applicationData.location = location || applicationData.location;
        applicationData.positionApplied = positionApplied || applicationData.positionApplied;
        applicationData.positionName = positionName || applicationData.positionName;
        applicationData.screeningStatus = screeningStatus || applicationData.screeningStatus;
        applicationData.round1 = round1 || applicationData.round1;
        applicationData.round2 = round2 || applicationData.round2;
        applicationData.round3 = round3 || applicationData.round3;
        applicationData.comments = comments || applicationData.comments;
        applicationData.email = email || applicationData.email;
        applicationData.workMode = workMode || applicationData.workMode;
        applicationData.workerType = workerType || applicationData.workerType;
        applicationData.status = status || applicationData.status;
        const pdfFile = req.file;
        if (pdfFile) {
            applicationData.resume = pdfFile.buffer;
        }


        // Save updated job requirement
        await applicationData.save();

        res.status(200).json({
            message: 'Job requirement updated successfully',
            applicationData
        });
    } catch (error) {
        console.error('Error updating job requirement:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const recruiterDeleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the job requirement by ID and delete it
        const deletedJob = await ApplicationSchema.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({ message: 'Application requirement not found' });
        }

        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getSingleApplication = async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: 'Email query parameter is required' });
        }

        const decodedEmail = decodeURIComponent(email);
        const applications = await ApplicationSchema.find({ email: decodedEmail }, { __v: 0 });
        const transformedRequirements = applications.map(data => {
            return {
                id: data._id.toString(),
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                yearsOfExperience: data.yearsOfExperience,
                techskills: data.techskills,
                location: data.location,
                positionApplied: data.positionApplied,
                positionName: data.positionName,
                screeningStatus: data.screeningStatus,
                round1: data.round1,
                round2: data.round2,
                round3: data.round3,
                comments: data.comments,
                resume: data.resume,
                status: data.status,
                workerType: data.workerType,
                workMode: data.workMode,
                chatInitiated: data.chatInitiated,
                roomID:data.roomID,
            };
        });
        res.status(200).json(transformedRequirements);
    } catch (error) {
        res.status(500).send(error);
    }
}