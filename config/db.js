const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI)
        console.log(`Connected to DB ${conn.connection.host}`)
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;