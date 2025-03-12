const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("Connect to " + conn.connection.host);
  } catch (error) {
    console.log("DB Connection Failed", error);
  }
};

module.exports = { connectDB };
