import { DataTypes } from "sequelize";

const Campaign = (sequelize) => {
  const campaign = sequelize.define(
    "Campaign",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "campaign",
      freezeTableName: true,
      timestamps: true,
    }
  );

  campaign.associate = (models) => {
    if (models.User) {
      campaign.belongsTo(models.User, {
        foreignKey: "userId",
        as: "projectLeader",
      });
    }
    if (models.Tree) {
      campaign.hasMany(models.Tree, {
        foreignKey: "campaignId",
        as: "trees",
      });
    }
  };

  return campaign;
};

export default Campaign;
