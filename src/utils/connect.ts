import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

async function connect() {
    const dbUri = config.get<string>("dbUri")

    try {
        await mongoose.connect(dbUri).then(() => {
            logger.info("Database connected to App")
        })
    } catch (error) {
        logger.error("Error connecting to database", error)
        process.exit(1)
    }
}

export default connect;