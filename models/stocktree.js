import { DataTypes } from "sequelize";

const StockTree = (sequelize) => {
  const stocktree = sequelize.define(
    "StockTree",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "stocktree",
      freezeTableName: true,
      timestamps: true,
    }
  );

  stocktree.associate = (models) => {
    stocktree.hasMany(models.Tree, {
      foreignKey: "stockTreeId",
      as: "trees",
    });
  };

  return stocktree;
};

export default StockTree;
