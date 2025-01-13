module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    "Team",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      serverUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ''
      },
      agentUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ''
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "teams",
      timestamps: false,
    },
  );

  return Team;
};
