require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/ai", require("./routes/ai"));


// ✅ SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// online users map
const onlineUsers = new Map();

io.on("connection", socket => {

  console.log("User connected:", socket.id);

  socket.on("join", userId => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", data => {

    const receiverSocket = onlineUsers.get(data.to);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", data);
    }

  });

  socket.on("disconnect", () => {

    for (let [key, val] of onlineUsers.entries()) {
      if (val === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }

    console.log("User disconnected:", socket.id);

  });

});


// start server
const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});