import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

// Middleware
app.use(cors()); 


app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true 
}));

app.use(express.json({limit: "16kb"})); // json ko parse krta h obj me convert krta h kyuki frontend se data json format me aata h aur backend me usko use krne ke liye obj me convert krna padta h.

app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public"));

app.use(cookieParser());

export default app;