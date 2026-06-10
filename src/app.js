import express from "express";
import dotenv from "dotenv";
import routePrompt from "./routers/routePrompt.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import { connectMongo } from "./config/mongo.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "1mb" }));

app.use("/api/prompts", routePrompt);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

async function startServer() {
    await connectMongo();

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
