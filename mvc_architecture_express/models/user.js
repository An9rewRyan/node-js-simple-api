const Sequelize = require("sequelize");

const sequelize = new Sequelize("sqlize", "root", "Verywell2017", {
    dialect: "mysql",
    host: "localhost",
    port: "3306",
  });

module.exports = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

sequelize.sync().then(result=>console.log(result))
.catch(err=> console.log(err));