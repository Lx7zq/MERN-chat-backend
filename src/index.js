require("dotenv").config();
const express = require("express"); // เพิ่มการนำเข้า express
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./lib/db");
const authRouter = require("./routes/auth.router");
const messageRouter = require("./routes/message.router");
const { app, server } = require("./lib/socket"); // Import app and server from socket.js

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

connectDB();
app.use(cors({ origin: BASE_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("<h1>Welcome to SE Chat Restful API</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);

// Start the server using the imported server object
server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
