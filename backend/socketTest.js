const { io } = require("socket.io-client");

const BUS_ID = "695e3a0698eacd084ffd9b8b";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to socket server:", socket.id);

  // Join bus room
  socket.emit("joinBus", BUS_ID);
  console.log("Joined bus room:", BUS_ID);
});

socket.on("locationUpdate", (data) => {
  console.log("📍 Live Location Update:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});
