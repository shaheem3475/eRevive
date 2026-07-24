const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
    try {
        // Set reliable public DNS servers if local system DNS refuses SRV queries
        try {
            dns.setServers(['8.8.8.8', '1.1.1.1']);
        } catch (dnsErr) {
            console.warn('Custom DNS resolver fallback failed, using default system DNS:', dnsErr.message);
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
