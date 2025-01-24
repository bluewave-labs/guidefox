const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// const compression = require("compression");
const jsonErrorMiddleware = require("./middleware/jsonError.middleware");
const fileSizeValidator = require("./middleware/fileSizeValidator.middleware");
const { MAX_FILE_SIZE } = require("./utils/constants.helper");
const ipFilter = require("./middleware/ipFilter.middleware");

// Load environment variables from .env file
dotenv.config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const mocks = require("./routes/mocks.routes");
const popup = require("./routes/popup.routes");
const guide_log = require("./routes/guidelog.routes");
const banner = require("./routes/banner.routes");
const teamRoutes = require("./routes/team.routes");
const hint = require("./routes/hint.routes");
const tourRoutes = require("./routes/tour.routes");
const linkRoutes = require("./routes/link.routes");
const helperLinkRoutes = require("./routes/helperLink.routes");
const guideRoutes = require("./routes/guide.routes");
const statisticsRoutes = require("./routes/statistics.routes");

const app = express();

app.use(cors());
app.options('*', cors()); // this is for preflight requests
app.use(helmet());
app.use(bodyParser.json({ limit: MAX_FILE_SIZE }));
// app.use(compression());
app.use(jsonErrorMiddleware);
if (process.env.ENABLE_IP_CHECK === 'true') {
  app.use(ipFilter);
}
// app.use(fileSizeValidator);


const { sequelize } = require("./models");

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

if (process.env.NODE_ENV == 'development') {
  sequelize
    .sync({ alter: true })
    .then(() => console.log("Models synced with the database..."))
    .catch((err) => console.log("Error syncing models: " + err));
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mock/", mocks);
app.use("/api/popup", popup);
app.use("/api/guide_log", guide_log);
app.use("/api/banner", banner);
app.use("/api/team", teamRoutes);
app.use("/api/guide", guideRoutes);
app.use("/api/hint", hint);
app.use("/api/tour", tourRoutes);
app.use("/api/link", linkRoutes);
app.use("/api/helper-link", helperLinkRoutes);
app.use("/api/statistics", statisticsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
