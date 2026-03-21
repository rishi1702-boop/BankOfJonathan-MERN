import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
        await mongoose.connect(mongoUri)
        console.log("Mongo COnnected");
        
    } catch (error) {
        console.log("Mongoose error: ",error);
        
    }
}

