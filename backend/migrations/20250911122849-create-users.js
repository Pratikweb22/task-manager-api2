'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
      },
      designation: {
        type: Sequelize.ENUM(
          "Software Intern",
          "Junior Software Engineer",
          "Senior Software Engineer",
          "Manager",
          "Senior Manager"
        ),
        allowNull: true,
        defaultValue: "Software Intern"
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop enum type first if using Postgres
    await queryInterface.dropTable('users');
  }
};
