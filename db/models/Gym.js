const SequelizeSlugify = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  const Gym = sequelize.define(
    "Gym",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "81 Tashan Ave, Jidhafs",
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 26.218976870620022,
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 50.54495015328686,
      },
    },
    { timestamps: false }
  );
  SequelizeSlugify.slugifyModel(Gym, {
    source: ["name"],
  });
  return Gym;
};
