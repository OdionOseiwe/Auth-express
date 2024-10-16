import mongoose from "mongoose";
export const connectDB = async ()=>{
    try { 
        console.log("mongodb", process.env.MONGO_URL);
        
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongodb", conn.connection.host);
        
    } catch (error) {
        console.log("error connecting to db", error);

        process.exit(1) // 1 is failure and 0 is success
        
    }
}