const express = require("express");

const {
  classList,
  classBook,
  fetchClass,
  classCancel,
  classUpdate,
} = require("../controllers/classControllers");
const router = express.Router();

router.param("classId", async (req, res, next, classId) => {
  const foundClass = await fetchClass(classId, next);
  if (foundClass) {
    req.class = foundClass;
    next();
  } else {
    next({
      status: 404,
      message: "Class Not Found",
    });
  }
});

router.get("/", classList);

router.put("/:classId/book", classBook);

router.put("/:classId", classUpdate);

router.put("/:classId/cancel", classCancel);

module.exports = router;
