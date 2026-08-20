const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("testDB", "postgres", "admin1245", {
  dialect: "postgres",
  // host: 'localhost'
});

module.exports = { sq: sequelize };
