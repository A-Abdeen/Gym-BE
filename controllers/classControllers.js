const { Class, User } = require("../db/models");
const User_Classes = require("../db/models/User_Classes");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

const sendMail = async (user, foundClass) => {
  const msg = {
    to: "mahmoodalwatani@gmail.com",
    from: "mahmoodalwatani@hotmail.com",
    subject: `Booking confirmation - ${foundClass.name} on ${foundClass.date}`,
    text: `Dear ${user.firstName},
      Thank you for booking a class with us! Your class of ${foundClass.name} will be on ${foundClass.date} at ${foundClass.time}.`,
    html: `<p> Dear ${user.firstName},
    Thank you for booking a class with us! Your class of ${foundClass.name} will be on ${foundClass.date} at ${foundClass.time}.</p>`,
  };
  try {
    await sgMail.send(msg);
    console.log(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
exports.fetchClass = async (classId, next) => {
  try {
    const foundClass = await Class.findByPk(classId);
    return foundClass;
  } catch (error) {
    next(error);
  }
};

exports.classList = async (req, res, next) => {
  try {
    const classes = await Class.findAll({
      include: {
        model: User,
        as: "users",
      },
    });
    res.json(classes);
  } catch (error) {
    next(error);
  }
};

exports.classBook = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.body.userId, {
      include: {
        model: Class,
        as: "classes",
      },
    });
    const foundClass = req.class;
    await user.addClass(req.class.id);
    sendMail(user, foundClass);
    res.status(201).json({
      id: user.id,
      username: user.username,
      password: user.password,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      classes: [...user.classes, foundClass],
    });
  } catch (error) {
    next(error);
  }
};

exports.classCancel = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.body.userId, {
      include: {
        model: Class,
        as: "classes",
      },
    });
    const foundClass = req.class;
    await user.removeClass(req.class.id);
    res.status(201).json({
      id: user.id,
      username: user.username,
      password: user.password,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      classes: [...user.classes.find((_class) => _class.id !== req.class.id)],
    });
  } catch (error) {
    next(error);
  }
};
