// const express = require('express');
// const app = express();
// const PORT = 3000;
// const bodyParser = require("body-parser");
// const cors = require('cors');
// const routes = require("./routes/index.js");
// const { dbConnection } = require('./config/db');
// const dotenv = require('dotenv');

// dotenv.config();









// app.use(express.json());






// dbConnection();
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());


// // If you are adding routes outside of the /api path, remember to
// // also add a proxy rule for them in web/frontend/vite.config.js
// //add route for maintenance api without authentication
// // app.use("/public/",maintenanceRoutes);
// // app.use("/api/*",shopify.validateAuthenticatedSession(), authenticateUser);
// app.use("/api", routes);

// app.use("/",(req,res)=>{
// res.send("yes Now you hit APis");
// });


// // app.use("/external/*",authenticateUser);
// // app.use("/external/",routes);


// app.listen(PORT, console.log("server is on port ", PORT));


// // app.listen(PORT, (err)=> {
// //     if (err) //console.log(err);
// //     {
// //         console.log(`SomeThing went wrong", ${err}`);
// //     } else {
// //         console.log("Server listening on PORT", PORT);

// //     }
// // });


// index.js

const express = require('express');
const http = require('http');
const app = express();

const server = http.createServer(app);
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require("body-parser");
const routes = require("./routes/index.js");
const { dbConnection } = require('./config/db');

dotenv.config();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Connect to DB
dbConnection();

// API Routes
app.use("/api", routes);

app.get("/", (req, res) => res.send("Yes, now you hit APIs"));

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Should be frontend domain in prod
    methods: ["GET", "POST"]
}});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Emit helper
function emitSettingUpdate(data) {
  console.log("📢 Emitting: settings:update", data);
  io.emit("settings:update", data); // emit to all connected clients
}

module.exports = {
  server,
  emitSettingUpdate
};



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 Server listening on port", PORT);
});
