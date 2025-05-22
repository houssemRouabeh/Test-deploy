"use strict";

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "avatar", {
      type: Sequelize.STRING,
      allowNull: true, // tu peux mettre false si tu veux rendre l'avatar obligatoire
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "avatar");
  },
};
