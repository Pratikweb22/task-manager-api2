"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ActivityLogs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Tasks", key: "id" },
        onDelete: "CASCADE",
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Comments", key: "id" },
        onDelete: "CASCADE",
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false, // e.g. TASK_ADDED, COMMENT_DELETED
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false, // e.g. "Alice added comment on Task A"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ActivityLogs");
  },
};

