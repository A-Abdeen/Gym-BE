const { Class, User } = require("../db/models");
const User_Classes = require("../db/models/User_Classes");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("ADD_KEY_HERE");

const sendMail = async (user, foundClass) => {
  const msg = {
    to: `${user.email}`,
    from: "mahmoodalwatani@hotmail.com",
    subject: `Booking confirmation for ${foundClass.name} on ${foundClass.date}`,
    text: `Dear ${user.firstName},
      Thank you for booking a class with us! Your class of ${foundClass.name} will be on ${foundClass.date} at ${foundClass.time}.`,
    html: `<p> Dear ${user.firstName},\n
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
    sendMail(user, updatedClass);
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
  } catch (error) {
    next(error);
  }
};
