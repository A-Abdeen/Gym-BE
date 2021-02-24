const express = require("express");
const db = require("./db/models/");
const passport = require("passport");

const classRoutes = require("./routes/classes");
const gymRoutes = require("./routes/gyms");
const typeRoutes = require("./routes/types");
const userRoutes = require("./routes/users");

const { localStrategy, jwtStrategy } = require("./middleware/passport");
const cors = require("cors");
const app = express();
const path = require("path");

//Middleware
console.log("__dirname", __dirname);
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use("/classes", classRoutes);
app.use("/gyms", gymRoutes);
app.use("/types", typeRoutes);
app.use(userRoutes);

app.use("/media", express.static(path.join(__dirname, "media")));

app.use((req, res, next) => {
  const error = {
    status: 404,
    message: "Path Not Found!",
  };
  next(error);
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

db.sequelize.sync();
// db.sequelize.sync({ alter: true });
// db.sequelize.sync({ force: true });
app.listen(8000);

//yarn add @sendgrid/mail --save
