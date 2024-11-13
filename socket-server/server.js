const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: {
    origin: "*", // Allow requests from any origin. Adjust in production.
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle trustee sending a key
  socket.on("send-key", (data) => {
    console.log(`Trustee sent key: ${data.keyPart}`);
    // Broadcast the key to all connected students
    socket.broadcast.emit("receive-key", { keyPart: data.keyPart });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

console.log("Socket server running on port 4000");
