require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 8080;
const cors = require('cors');
const routes = require("./routes/index.js");
const { dbConnection } = require('./config/db');
// const { initSocket } = require('./socket'); // adjust path
const helmet = require('helmet');
const multer = require('multer');
// const { startScheduler } = require("./scheduler/cronJob.js");
const { ConnectCloadinary } = require('./config/cloudinary.js');
const cookieParser = require("cookie-parser");
const { verifyShopifyWebhook } = require('./schema/customerValidation.js');
const { orderPaymentDoneForOrderWEbHooks } = require('./controller/customer.controller.js');
const cron = require("node-cron");
const { runCleanupNow } = require("./utils/cleanDesigns.js");
const {sendResponse} = require('./utils/sendResponse.js');
const { statusCode } = require('./constant/statusCodes.js');


ConnectCloadinary();

app.post('/order-payment', express.raw({ type: 'application/json' }), verifyShopifyWebhook, orderPaymentDoneForOrderWEbHooks);



// Setup middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
}

// Routes
app.use("/api", routes);


//delete old design which have more then 30 days
cron.schedule('0 2 * * *', async () => {
  console.log(`🗑️ [Cron] Running daily cleanup...`);
  await runCleanupNow({ days: 30 });
});

// startScheduler(); // start scheduled sync for product S&S to Shopify

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    sendResponse(res, statusCode.BAD_REQUEST, false,  "File size is too large (max 10MB)");
    return;
  }

  if (err instanceof multer.MulterError) {
    sendResponse(res, statusCode.BAD_REQUEST, false,  "File size is too large (max 10MB)");
    return;
  }

  console.error("Unhandled error:", err);
  sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, err.message || "Internal Server Error");
  return;
});


// Test route
app.use("/", (req, res) => res.send("✅ Yes, Now you can hit APIs"));

const startServer = async () => {
  try {
    await dbConnection();
    server.listen(PORT, () => {
      console.log(`Current server time: ${new Date()}`);
      console.log(`Current server time: ${new Date().toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`);
      console.log(` ✅ Server is ready to listen on port ${PORT}`);
    });
    //for real sync
    // initSocket(server);
  } catch (err) {
    console.error(`❌Someting Went Wrong in Start Server, Error is  ${err}`);
    process.exit(1);
  }
}

startServer();


