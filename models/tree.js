import { DataTypes } from "sequelize";

const Tree = (sequelize) => {
  const tree = sequelize.define(
    "Tree",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      campaignId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "campaign",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      stockTreeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "stocktree",
          key: "id",
        },
      },
      dateOfPurchase: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      plantingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gpsCoordinates: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "tree",
      freezeTableName: true,
      timestamps: true,
    }
  );

  tree.associate = (models) => {
    if (models.User) {
      tree.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
    if (models.Campaign) {
      tree.belongsTo(models.Campaign, {
        foreignKey: "campaignId",
        as: "campaign",
      });
    }
    if (models.StockTree) {
      tree.belongsTo(models.StockTree, {
        foreignKey: "stockTreeId",
        as: "stocktree",
      });
    }
  };

  return tree;
};

export default Tree;
