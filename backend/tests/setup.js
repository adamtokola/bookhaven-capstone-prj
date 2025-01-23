const { sequelize } = require('../app/models');

beforeAll(async () => {
  // Ensure tables are created
  await sequelize.sync({ force: true });
});

// Clear database between tests
afterEach(async () => {
  await Promise.all([
    sequelize.query('TRUNCATE TABLE comments CASCADE'),
    sequelize.query('TRUNCATE TABLE reviews CASCADE'),
    sequelize.query('TRUNCATE TABLE books CASCADE'),
    sequelize.query('TRUNCATE TABLE users CASCADE')
  ]);
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
}); 