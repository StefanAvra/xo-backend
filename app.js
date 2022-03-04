import express from "express";
import http from "http";
import { Server } from "socket.io";
import chalk from "chalk";
import shortUUID from "short-uuid";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: true });

// const cors = require("cors");

const PORT = process.env.PORT || 3001;

// app.use(cors());

app.use((req, res, next) => {
    console.log(chalk.green(req.method), req.url);
    next();
});

app.get("/", (req, res) => {
    res.send("hi👋");
});

app.get("/newuuid", (req, res) => {
    res.send(shortUUID().new());
});

io.on("connection", (socket) => {
    let room;
    console.log(`new socket: \n${socket.id}`);

    socket.on("init", (data) => {
        socket.emit("new_room", shortUUID().new());
        console.log("made new room");
    });

    socket.on("join", (newRoom) => {
        room = newRoom;
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
    });

    socket.on("played", (data) => {
        console.log(`${socket.id} played ${data}`);
    });

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});

server.listen(PORT, console.log("express listening ..."));
