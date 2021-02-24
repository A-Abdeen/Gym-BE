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
    if (
      user.classes.some(
        (_class) =>
          _class.time === foundClass.time && _class.date === foundClass.date //check if user booked class with same time
      )
    )
      next({ message: "You already have a class at this time" });

    if (
      user.classes.filter((_class) => _class.date === foundClass.date).length >= //check if user already has 3 (or more) of classes on this date
      3
    )
      next({ message: `Max Classes on ${foundClass.date} reached` });
    await user.addClass(req.class.id);
    // sendMail(user, foundClass);
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
    let floatTime =
      +req.class.time.split(":")[0] + +req.class.time.split(":")[1] / 60; //convert string 24H time to float hours
    let checkTime =
      Date.now() + 3 * 3600000 < // current date in gmt + 3 hours in milliseconds
      Date.parse(foundClass.date) + floatTime * 3600000; //date of class in milliseconds + float hours in milliseconds
    if (checkTime) {
      await user.removeClass(req.class.id);
      res.status(201).json({
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        classes: user.classes.filter((_class) => _class.id !== req.class.id),
      });
    } else next({ message: "Class already started" });
  } catch (error) {
    next(error);
  }
};
