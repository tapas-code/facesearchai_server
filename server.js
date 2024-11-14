require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripeRoutes = require("./routes/stripe");
const uploadRoutes = require("./routes/upload");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 4040;

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use("/api/stripe", stripeRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("SERVER RUNNING.");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
