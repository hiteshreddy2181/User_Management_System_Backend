import ClientPostRequirement from "../models/clientPostRequirement.js";
import ApplicationSchema from "../models/applicationSchema.js";

export const ClientBulkUpload = async (req, res) => {
    try {
        const data = req.body.data;
        const files = req.files;
        console.log(data);
        
        const jobs = [];
        const fileMap = {};

        files.forEach((file) => {
            const key = file.fieldname.match(/data\[(\d+)\]\[JD\]/)[1];
            fileMap[key] = file.buffer;
        });

        data.forEach((jobData, index) => {
            const job = {};

            Object.keys(jobData).forEach((key) => {
                job[key] = jobData[key];
            });

            job.JD = fileMap[index];
            jobs.push(job);
        });

        const result = await ClientPostRequirement.insertMany(jobs);

        res.status(200).json({ message: 'Bulk upload successful', result });
    } catch (error) {
        console.error('Error during bulk upload', error);
        res.status(500).json({ error: 'Bulk upload failed' });
    }
};

export const ApplicationBulkUpload = async (req, res) => {
    try {
        const data = req.body.data; // Access the nested data array
        const files = req.files;
        console.log(data);

        const applications = [];
        const fileMap = {};

        files.forEach((file) => {
            const key = file.fieldname.match(/data\[(\d+)\]\[resume\]/)[1];
            fileMap[key] = file.buffer;
        });

        for (const [index, appData] of data.entries()) {
            const {
                firstName,
                lastName,
                techskills,
                location,
                email,
                yearsOfExperience,
                positionId
            } = appData;

            if (!fileMap[index]) {
                return res.status(400).json({ message: `Resume PDF is required for entry ${index + 1}` });
            }

            const jobRequirement = await ClientPostRequirement.findById(positionId);
            if (!jobRequirement) {
                return res.status(404).json({ message: `Application not found for entry ${index + 1}` });
            }

            const newApplication = new ApplicationSchema({
                firstName,
                lastName,
                email,
                yearsOfExperience: yearsOfExperience,
                techskills: techskills,
                location,
                positionApplied: positionId,
                positionName: jobRequirement.positionName,
                screeningStatus: 'Pending',
                resume: fileMap[index],
                status: 'Applied',
                workerType: jobRequirement.workerType,
                workMode: jobRequirement.workMode
            });

            applications.push(newApplication);
        }

        const result = await ApplicationSchema.insertMany(applications);

        res.status(200).json({ message: 'Bulk upload successful', result });
    } catch (error) {
        console.error('Error during bulk upload', error);
        res.status(500).json({ error: 'Bulk upload failed' });
    }
};
