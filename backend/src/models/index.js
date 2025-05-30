const { Sequelize } = require("sequelize");
const config = require("../../config/config.js");

const env = process.env.NODE_ENV || "development";
const envConfig = config[env];

const sequelize = new Sequelize(
  envConfig.database,
  envConfig.username,
  envConfig.password,
  {
    host: envConfig.host,
    dialect: envConfig.dialect,
    port: envConfig.port,
    logging: envConfig.logging,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./User.js")(sequelize, Sequelize.DataTypes);
db.Popup = require("./Popup.js")(sequelize, Sequelize.DataTypes);
db.Token = require("./Token.js")(sequelize, Sequelize.DataTypes);
db.GuideLog = require("./GuideLog.js")(sequelize, Sequelize.DataTypes);
db.Banner = require("./Banner.js")(sequelize, Sequelize.DataTypes);
db.Team = require("./Team.js")(sequelize, Sequelize.DataTypes);
db.Invite = require("./Invite.js")(sequelize, Sequelize.DataTypes);
db.Hint = require("./Hint.js")(sequelize, Sequelize.DataTypes);
db.Link = require("./Link.js")(sequelize, Sequelize.DataTypes);
db.HelperLink = require("./HelperLink.js")(sequelize, Sequelize.DataTypes);
db.Tour = require("./Tour.js")(sequelize, Sequelize.DataTypes);
db.TourPopup = require("./TourPopup.js")(sequelize, Sequelize.DataTypes);

// Define associations here
db.User.hasMany(db.Popup, { foreignKey: "createdBy", as: "popups" });
db.Popup.belongsTo(db.User, { foreignKey: "createdBy", as: "creator" });

db.User.hasMany(db.HelperLink, { foreignKey: "createdBy", as: "links" });
db.HelperLink.belongsTo(db.User, { foreignKey: "createdBy", as: "creator" });

db.HelperLink.hasMany(db.Link, { foreignKey: "helperId", as: "links" });
db.Link.belongsTo(db.HelperLink, { foreignKey: "helperId", as: "helper" });

db.User.hasMany(db.Banner, { foreignKey: "createdBy", as: "banners" });
db.Banner.belongsTo(db.User, { foreignKey: "createdBy", as: "creator" });

db.Tour.hasMany(db.TourPopup, { foreignKey: "tourId", as: "steps" });
db.TourPopup.belongsTo(db.Tour, { foreignKey: "tourId", as: "tour" });

db.Invite.belongsTo(db.User, { foreignKey: "invitedBy" });
db.User.hasMany(db.Invite, { foreignKey: "invitedBy" });
db.User.hasMany(db.Hint, { foreignKey: "createdBy", as: "hints" });
db.Hint.belongsTo(db.User, { foreignKey: "createdBy", as: "creator" });
db.User.hasMany(db.Tour, { foreignKey: "createdBy", as: "tours" });
db.Tour.belongsTo(db.User, { foreignKey: "createdBy", as: "creator" });

module.exports = db;
