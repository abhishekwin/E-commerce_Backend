// app.js
const express = require("express");
const router = require("./src/routers/index.routes");
const port = process.env.PORT;
const app = express();

// Body parser

app.use(express.json({ limit: "100kb" }));
// app.use(express.urlencoded({ extended: false }));

const cors = require("cors");
const db = require("./src/models/index");

const startServer = async () => {
  try {
    await db.authenticate();
    app.use(
      cors({
        origin: "*",
      }),
    );
    app.use("/api", router);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
    const { initializeAdmin, intilize_user_roles } = require("./middleware");
    await intilize_user_roles();
    await initializeAdmin()
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
