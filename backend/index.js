require("dotenv").config();
const app = require("./app/app");
const { sequelize } = require("./app/models");

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
