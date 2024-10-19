import mongoose from "mongoose";

const MONGOURL = "mongodb+srv://jayadeepreddy825:jOX8h7VWs9pTdSAm@cluster0.nxjqpjn.mongodb.net/HiringPortal";
const connect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGOURL, {useNewUrlParser: true})
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((error) => {
        console.log("database connection failed exiting now...");
        console.error(error);
        process.exit(1);
    });
}

export default connect;