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
        attributes: ["id"],
      },
    });
    res.json(classes);
  } catch (error) {
    next(error);
  }
};

exports.classUpdate = async (req, res, next) => {
  try {
    const updatedClass = await req.class.update(req.body);
    res.status(201).json(updatedClass);
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
    // if (
    //   user.classes.some(
    //     (_class) =>
    //       _class.time === req.class.time && _class.date === req.class.date //check if user booked class with same time
    //   )
    // )
    //   next({ message: "You already have a class at this time" });

    // if (
    //   user.classes.filter((_class) => _class.date === req.class.date).length >= //check if user already has 3 (or more) of classes on this date
    //   3
    // )
    //   next({ message: `Max Classes on ${req.class.date} reached` });
    let updatedClass = await req.class.update({
      bookedSeats: +req.class.bookedSeats + 1,
    });
    await user.addClass(req.class.id);
    updatedClass = await Class.findByPk(req.class.id, {
      include: {
        model: User,
        as: "users",
        attributes: ["id"],
      },
    });
    // sendMail(user, foundClass);
    res.status(201).json(updatedClass);
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
    // let floatTime =
    //   +req.class.time.split(":")[0] + +req.class.time.split(":")[1] / 60; //convert string 24H time to float hours
    // let checkTime =
    //   Date.now() + 3 * 3600000 < // current date in gmt + 3 hours in milliseconds
    //   Date.parse(req.class.date) + floatTime * 3600000; //date of class in milliseconds + float hours in milliseconds
    // if (checkTime) {
    let updatedClass = await req.class.update({
      bookedSeats: +req.class.bookedSeats - 1,
    });
    await updatedClass.removeUser(req.body.userId);
    updatedClass = await Class.findByPk(req.class.id, {
      include: {
        model: User,
        as: "users",
        attributes: ["id"],
      },
    });
    console.log(updatedClass.toJSON());
    res.status(201).json(updatedClass);
    // } else next({ message: "Class already started" });
  } catch (error) {
    next(error);
  }
};
