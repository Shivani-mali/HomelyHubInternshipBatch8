import mongoose from "mongoose";

const connectDB = async()=> {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDb is Conneceted!");
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
        //prgram ended with eroor:
        //process.exit(0)-- program ended successfully
        //process.exist(1)-- program ended with error
        
        process.exit(1); // Exit the process with an error code
    }

};

export default connectDB;