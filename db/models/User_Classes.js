module.exports = (sequelize) => {
  const User_Classes = sequelize.define(
    "User_Classes",
    {},
    { timestamps: false }
  );
  return User_Classes;
};
