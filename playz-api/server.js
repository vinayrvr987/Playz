const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");

const app = express();

const PORT = 5000;
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/playz")
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
