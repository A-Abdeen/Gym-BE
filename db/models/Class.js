const { Op } = require("sequelize");
const SequelizeSlugify = require("sequelize-slugify");
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define(
    "Class",
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notContains: "event",
        },
      },
      slug: {
        type: DataTypes.STRING,
      },
      numOfSeats: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
      },
      bookedSeats: {
        type: DataTypes.INTEGER,
        validate: {
          bookedGreaterThanNum: function (value) {
            if (+value > +this.numOfSeats) {
              throw new Error("bookedSeats cannot be greater than numOfSeats!");
            }
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    { timestamps: false }
  );
  SequelizeSlugify.slugifyModel(Class, {
    source: ["name"],
  });
  return Class;
};
