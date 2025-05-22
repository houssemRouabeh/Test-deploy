import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const User = (sequelize) => {
  const user = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "firstname",
        defaultValue: "Unknown",
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "lastname",
        defaultValue: "Unknown",
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      locality: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "default.png",
      },
    },
    {
      tableName: "users",
      freezeTableName: true,
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
    }
  );

  user.associate = (models) => {
    if (models.Order) {
      user.hasMany(models.Order, {
        foreignKey: "userId",
        as: "order",
      });
    }
    if (models.Campaign) {
      user.hasMany(models.Campaign, {
        foreignKey: "userId",
        as: "managedCampaigns",
      });
    }
  };

  user.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return user;
};

export default User;
