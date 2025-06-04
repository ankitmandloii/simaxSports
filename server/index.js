const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const PORT = 3000;
const bodyParser = require("body-parser");
const cors = require('cors');
const routes = require("./routes/index.js");
const { dbConnection } = require('./config/db');
const dotenv = require('dotenv');
const { initSocket } = require('./socket'); // adjust path
initSocket(server);

dotenv.config();

// Setup middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Connect to DB
dbConnection();

// Routes
app.use("/api", routes);

// Test route
app.use("/", (req, res) => {
  res.send("Yes, now you hit APIs");
});



// Start the server
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
