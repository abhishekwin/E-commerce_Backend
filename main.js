// app.js
const express = require("express");
const router = require("./src/routers/index.routes");
const port = process.env.PORT;
const app = express();

const cors = require("cors");
const db = require("./src/models/index");
const { initializeAdmin, intilize_user_roles } = require("./middleware");

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
    await db.authenticate();
    app.use(express.json({ limit: "100kb" }));
    app.use(
      cors({
        origin: "*",
      }),
    );
    app.use("/api", router);
    await intilize_user_roles();
    await initializeAdmin();
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
