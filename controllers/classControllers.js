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

exports.classBook = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Class,
        as: "classes",
      },
    });
    await user.addClass(req.class.id);
    res.status(201).json({
      ...user,
      classes: [...user.classes, req.body.classId],
    });
  } catch (error) {
    next(error);
  }
};
