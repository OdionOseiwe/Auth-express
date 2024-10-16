import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
import { connectDB } from './db/connectdb.js';
import authRoutes from './routes/auth.route.js'
import path from "path";


const app = express();
const PORT = process.env.PORT || 5000
const __dirname = path.resolve();
app.use(cors({origin:"http://localhost:3000", credentials:true}))
app.use(express.json())
app.use(cookieParser())


// routes
app.use("/api/auth",authRoutes);

if (process.env.NODE_ENV === "production" ) {
    app.use(express.static(path.join(__dirname, "frontend/build")));

    app.get("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    })
}

app.listen(PORT, ()=>{
    connectDB() // connecting to mongoDB 
    console.log("started server is running port: ", PORT);
    
})

