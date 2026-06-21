import express from "express";
import authRouter from './modules/auth/router/auth-router.js'
import cors from "cors"
import errorMiddleware from "./middlewares/error-middleware.js";
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json());

app.use("/api/auth/", authRouter);


app.use(errorMiddleware)

export default app;