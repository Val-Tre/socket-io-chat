const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);

const socketIO = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

socketIO.on("connection", (socket) => {
    console.log(`${new Date(Date.now())}: User ${socket.id} Connected`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log(`${new Date(Date.now())}: User ${socket.id} Disconnected`);
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
});
