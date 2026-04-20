const express = require('express')
const app = express()
const connectDB = require("./Config/db.js")
// const port = 3000
const port = process.env.PORT || 3000;
const UserRoutes = require("./Routes/UserRoutes.js")
const cors = require('cors')
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

// attach socket
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

const io = new Server(server, {
  cors: {
    origin: "https://collab-desk-gamma.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

//functions of socket

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join task room
  socket.on("joinTask", ({ taskId, userId }) => {
    socket.join(taskId);

    // store userId in socket
    socket.userId = userId;
  });

  // send message
  socket.on("sendMessage", (data) => {
    // send to all users in same task room
    io.to(data.taskId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  
});


// app.use(cors())
app.use(cors({
  origin: "https://collab-desk-gamma.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/api",UserRoutes)
app.set("io", io);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB()

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})