const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const app = express();

app.use(cors());
app.use(express.json());
const users = [{}];

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined `);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: ` ${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat,${users[socket.id]} `,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]}  has left`,
    });
    console.log(`user left`);
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

server.listen(PORT, () => {
  console.log(`Working`);
});
