import dotenv from "dotenv";
dotenv.config({ quiet: true });
import connectDB from "./src/config/connectDB.js";
import dns from 'node:dns'
import app from "./src/app.js";

const port = process.env.PORT || 8080;
dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
])





connectDB();
try {

    app.listen(port, () => {
        console.log(`🚀 Server started successfully on port ${port} `)
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    })

    process.on('uncaughtException', (err) => {
        console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
        console.error(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });

    process.on('unhandledRejection', (err) => {
        console.error('❌ UNHANDLED REJECTION! Shutting down...');
        console.error(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });

    process.on('SIGTERM', () => {
        console.log('📴 SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            console.log('✅ Process terminated');
            process.exit(0);
        });
    });

} catch (err) {
    console.log("Failed to start sarver : ", err);
    process.exit(1);
}