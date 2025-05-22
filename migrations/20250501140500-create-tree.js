export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("tree", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    campaignId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "campaign",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    stockTreeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "stocktree",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    dateOfPurchase: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    plantingDate: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    gpsCoordinates: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("tree");
}
