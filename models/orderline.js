import { DataTypes } from "sequelize";

const OrderLine = (sequelize) => {
  const orderLine = sequelize.define(
    "OrderLine",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        field: "orderId",
      },
      treeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tree",
          key: "id",
        },
        field: "treeId",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commandlineTotal: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "orderline",
      freezeTableName: true,
      timestamps: true,
    }
  );

  orderLine.associate = (models) => {
    if (models.Order) {
      orderLine.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
    }
    if (models.Tree) {
      orderLine.belongsTo(models.Tree, {
        foreignKey: "treeId",
        as: "tree",
      });
    }
  };

  return orderLine;
};

export default OrderLine;
