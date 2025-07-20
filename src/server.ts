import app from './app';
import config from './config';
import { connectDB } from './config/database';
import redisClient from './config/redis';

const restartServer = async () => {
    try {
        await Promise.all([connectDB(), redisClient.connect()]);
        console.log("DB connected...");

        const server = app.listen(config.PORT, () => {
            console.log(`Server listening on port ${config.PORT}`);
        });

        process.on("unhandledRejection", (reason) => {
            console.error("Unhandled Rejection:", reason);
            server.close(() => {
                process.exit(1);
            });
        });

        process.on("SIGINT", async () => {
            console.log("SIGINT received. Shutting down...");
            await redisClient.quit();
            server.close(() => {
                process.exit(0);
            });
        });

    } catch (error) {
        console.log('Startup error:', error);
        process.exit(1);
    }
};

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

restartServer();
