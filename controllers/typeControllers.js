const { Type } = require("../db/models");

// exports.fetchType = async (typeId, next) => {
//   try {
//     const foundType = await Type.findByPk(typeId);
//     return foundType;
//   } catch (error) {
//     next(error);
//   }
// };

exports.typeList = async (req, res, next) => {
  try {
    const types = await Type.findAll();
    res.json(types);
  } catch (error) {
    next(error);
  }
};

exports.typeCreate = async (req, res, next) => {
  try {
    const newType = await Type.create(req.body);
    res.status(201).json(newType);
  } catch (error) {
    next(error);
  }
};
