require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 8080;
const bodyParser = require("body-parser");
const cors = require('cors');
const routes = require("./routes/index.js");
const { dbConnection } = require('./config/db');
const { initSocket } = require('./socket'); // adjust path


//for real sync
initSocket(server);



// Setup middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Connect to DB
dbConnection();

// Routes
app.use("/api", routes);

// Test route
app.use("/", (req, res) => {
  res.send("Yes, Now you can hit APIs");
});



// Start the server
server.listen(PORT, (err) => {
  if (err) {
    console.log(`Someting Went Wrong in Server, Error is  ${err}`);
  } else {
    console.log(`Server is ready to listen on port ${PORT}`);
  }
});
