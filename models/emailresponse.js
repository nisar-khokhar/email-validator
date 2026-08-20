const { DataTypes } = require("sequelize");
const { sq } = require("../config/db");

const emailresponse = sq.define("emailresponse", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Email: {
    type: DataTypes.STRING,
  },

  Valid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  Reason: {
    type: DataTypes.STRING,
  },

  Typo: {
    type: DataTypes.BOOLEAN,
  },

  Smtp: {
    type: DataTypes.BOOLEAN,
  },

  Regex: {
    type: DataTypes.BOOLEAN,
  },

  Disposible: {
    type: DataTypes.BOOLEAN,
  },

  Mx: {
    type: DataTypes.BOOLEAN,
  },
});

emailresponse.sync({ force: true }).then(() => {
  console.log("emailresponse table created");
});

module.exports = { emailresponse };

/*REGEX: {
    type: DataTypes.BOOLEAN,
    // defaultValue: true,
  },

  TYPO: {
    type: DataTypes.BOOLEAN,
    // defaultValue: true,
  },

  DISPOSIBLE: {
    type: DataTypes.BOOLEAN,
    // defaultValue: true,
  },

  MX: {
    type: DataTypes.BOOLEAN,
    // defaultValue: true,
  },

  SMTP: {
    type: DataTypes.BOOLEAN,
    // defaultValue: true,
  },*/
