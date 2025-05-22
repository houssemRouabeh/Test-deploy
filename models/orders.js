import { DataTypes } from "sequelize";

const Order = (sequelize) => {
  const order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        field: "userId",
      },
      orderDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "orderDate",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "orders",
      freezeTableName: true,
      timestamps: true,
    }
  );

  order.associate = (models) => {
    if (models.User) {
      order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
    if (models.OrderLine) {
      order.hasMany(models.OrderLine, {
        foreignKey: "orderId",
        as: "orderLines",
      });
    }
  };

  return order;
};

export default Order;
