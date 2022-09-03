const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

// helps resolve server issues
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// an event listener
io.on("connection", (socket) => {
    console.log(`User ${socket.id} has connected`);

    // print message when user joins a room
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`)
    });

    // receive from front end and send back to users in same room
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnect", socket.id);
    });
});

// server start
server.listen(3001, () => {
    console.log("Server is running...");
});