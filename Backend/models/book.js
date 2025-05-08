'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Book.init({
    bookName: DataTypes.STRING,
    Author: DataTypes.STRING,
    Publisher: DataTypes.STRING,
    Subject: DataTypes.STRING,
    Publication_year: DataTypes.NUMERIC,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });

  return Book;
};
