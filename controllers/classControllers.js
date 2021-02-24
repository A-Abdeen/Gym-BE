const { Class } = require("../db/models");

// exports.fetchClass = async (classId, next) => {
//   try {
//     const foundClass = await Class.findByPk(classId);
//     return foundClass;
//   } catch (error) {
//     next(error);
//   }
// };

exports.classList = async (req, res, next) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (error) {
    next(error);
  }
};
