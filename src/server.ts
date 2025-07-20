// import app from './app';
// import config from './config';
// import { connectDB } from './config/database';
// import redisClient from './config/redis';

// const restartServer = async () => {
//     try {
//         await Promise.all([connectDB(), redisClient.connect()]);
//         console.log("DB connected...");

//         const server = app.listen(config.PORT, () => {
//             console.log(`Server listening on port ${config.PORT}`);
//         });

//         process.on("unhandledRejection", (reason) => {
//             console.error("Unhandled Rejection:", reason);
//             server.close(() => {
//                 process.exit(1);
//             });
//         });

//         process.on("SIGINT", async () => {
//             console.log("SIGINT received. Shutting down...");
//             await redisClient.quit();
//             server.close(() => {
//                 process.exit(0);
//             });
//         });

//     } catch (error) {
//         console.log('Startup error:', error);
//         process.exit(1);
//     }
// };

// process.on("uncaughtException", (err) => {
//     console.error("Uncaught Exception:", err);
//     process.exit(1);
// });

// restartServer();


import serverless from "serverless-http";
import { connectDB } from "./config/database";
import redisClient from "./config/redis";
import app from "./app";

let initialized = false;

// Wrap Express app in serverless
const handler = async (event: any, context: any) => {
  // Lazy initialization (Netlify cold starts)
  if (!initialized) {
    try {
      await Promise.all([connectDB(), redisClient.connect()]);
      console.log("DB and Redis connected...");
      initialized = true;
    } catch (error) {
      console.error("Startup error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to connect DB or Redis" }),
      };
    }
  }

  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

export { handler };
