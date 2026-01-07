// require("dotenv").config();
// const dbconnection = require("./config/DbConnection");
// const cors = require("cors");
// const express = require("express");
// const path = require("path");
// const ApiRouter = require("./routes/ApiRoutes");

// const app = express();
// app.use(express.json());
// app.use(cors());

// // ✅ Serve static files for uploaded images
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // 🔹 Connect to MongoDB before starting routes
// (async () => {
//   try {
//     await dbconnection();
//     app.use("/crm/api", ApiRouter);
//     const port = process.env.PORT || 4005;
//     app.listen(port, () => {
//       console.log(`Server started on port ${port}`);
//     });

//   } catch (error) {
//     console.error("❌ Failed to start server:", error);
//   }
// })();

// console.log("hello this is CRM server");

require("dotenv").config();
const dbconnection = require("./config/DbConnection");
const cors = require("cors");
const express = require("express");
const path = require("path");
const ApiRouter = require("./routes/ApiRoutes");
const http = require("http");
const { initSocket } = require("./middleware/socket"); // ✅ import

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

(async () => {
  try {
    await dbconnection();
    app.use("/crm/api", ApiRouter);

    const port = process.env.PORT || 4005;

    // ✅ Create HTTP server & initialize socket
    const server = http.createServer(app);
    const io = initSocket(server);

    // Make io available globally in app
    app.set("io", io);

    server.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
})();
