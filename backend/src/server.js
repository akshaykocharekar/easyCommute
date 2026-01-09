require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const server = http.createServer(app);
const { Server } = require("socket.io");

connectDB();

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Make io accessible everywhere
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinBus", (busId) => {
    socket.join(busId);
    console.log(`Socket ${socket.id} joined bus ${busId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
