const settings = require("../../config/settings");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(63),
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING(63),
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(127),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(settings.user.roleEnum),
        defaultValue: settings.user.role.admin,
        allowNull: false,
      },
      picture: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: false, // Disable timestamp
    },
  );

  return User;
};
