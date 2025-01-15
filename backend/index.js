
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./app/models");
const authRoutes = require("./app/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database synchronized");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("Error syncing database:", err));
