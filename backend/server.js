
import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './connection/connect.js';
import userRoute from './routes/userRoutes.js'

const app = express();
dotenv.config()
app.use(express.json());

app.use("/api/v1/user/", userRoute)

const PORT = process.env.PORT || 8080
app.listen(PORT, async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        console.log(`listening on port ${PORT}`)
    } catch (error) {
        console.log(error.message)
    }
});