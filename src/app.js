
const express = require('express');

const app = express();
const uploadRoutes = require('./routes/uploadRoutes');

app.use(express.json());
app.use("/api/upload", uploadRoutes);
app.get("/", (req, res) => {
  res.send("SnapSave Server Running 🚀");
});

module.exports=app;
