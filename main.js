// app.js
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./src/routers/index.routes");
const port = process.env.PORT;
const app = express();
app.use(bodyParser.json());
require("./src/models/index");

const cors = require("cors");
const { initializeAdmin } = require("./middleware/admin");

const startServer = async () => {
  try {
    await initializeAdmin();
    app.use(
      cors({
        origin: "*",
      }),
    );
    app.use("/api", router);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
