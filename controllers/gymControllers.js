const { Gym, Class, Type } = require("../db/models");

exports.fetchGym = async (gymId, next) => {
  try {
    const foundGym = await Gym.findByPk(gymId);
    return foundGym;
  } catch (error) {
    next(error);
  }
};

exports.gymList = async (req, res, next) => {
  try {
    const gyms = await Gym.findAll({
      include: {
        model: Class,
        as: "classes",
        attributes: ["id"],
      },
    });
    res.json(gyms);
  } catch (error) {
    next(error);
  }
};

exports.gymCreate = async (req, res, next) => {
  try {
    console.log(req.user);
    if (req.user.userType === "admin") {
      const newGym = await Gym.create(req.body);
      res.status(201).json(newGym);
    } else {
      next({
        status: 401,
        message: "You are not authorized to create a Gym",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.classCreate = async (req, res, next) => {
  try {
    if (req.user.userType === "admin") {
      req.body.gymId = req.gym.id;
      const newClass = await Class.create(req.body);
      res.status(201).json(newClass);
    } else {
      next({
        status: 401,
        message: "You are not authorized to create a Class",
      });
    }
  } catch (error) {
    next(error);
  }
};
