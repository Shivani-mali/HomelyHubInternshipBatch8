import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import { router as userRouter } from "./routes/userRoutes.js";
import { propertyRouter } from "./routes/propertyRouter.js";
import { bookingRouter } from "./routes/bookingRouter.js";
import { tripRouter } from "./routes/tripRouter.js";

//import librarey
dotenv.config();
const app = express(); //create the app

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

//1st Middleware: express.json() is a built-in middleware function in Express.
app.use(express.json({ limit: "100mb" }))


//2nd Middlewear: urlencoded
app.use(express.urlencoded({ limit: "100mb", extended: true }))  //nested data within here it can handle the data within the proper way:


//3rd Middlewear : Cookiewear():
app.use(cookieParser())

//CookieParser:
app.use(cookieParser())

app.use(cors({
    origin: process.env.ORIGIN_ACCESS_URL,
    credentials: true,
}));

//test route:
app.use('/api/v1/rent/listing', propertyRouter);
app.use('/api/v1/rent/user', userRouter);
app.use('/api/v1/rent/user/booking', bookingRouter)
app.use('/api/v1/rent/user/trip', tripRouter)

//add the port number
const port = Number(process.env.PORT || process.env.port || 8080);

//one test: write as function functionname(){}, or arrow function
app.get("/", (req, res) => {
    res.send("Homely hub server is run")
})

//connect to the database
connectDB();


app.listen(port, () => {
    console.log(`App is running on port no:${port}`);
})
