// app.js
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./src/routers/index.routes')
const port = process.env.PORT
const app = express();
const {initializeAdmin} = require("./middleware/admin")
app.use(bodyParser.json());
require ('./src/models/db.config')
const cors = require('cors');


const startServer = async () =>{
  try{
    // await initializeAdmin()
    app.use(cors())
    app.use("/api", router)
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

    }
  catch(error){
    console.error('Error starting the server:', error);
  }
}

startServer();