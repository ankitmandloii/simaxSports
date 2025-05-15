const express = require('express');
const app = express();
const PORT = 4000;
const bodyParser = require("body-parser");
const cors = require('cors');
const routes = require("./routes/index");
const { dbConnection } = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();







app.use(express.json());






dbConnection();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js
//add route for maintenance api without authentication
// app.use("/public/",maintenanceRoutes);
// app.use("/api/*",shopify.validateAuthenticatedSession(), authenticateUser);
app.use("/api", routes);

app.get("/",(req,res)=>{
res.send("yes Now you hit APis");
})
// app.use("/external/*",authenticateUser);
// app.use("/external/",routes);

app.listen(PORT, (err)=> {
    if (err) //console.log(err);
    {
        console.log(`SomeThing went wrong", ${err}`);
    } else {
        console.log("Server listening on PORT", PORT);

    }
});