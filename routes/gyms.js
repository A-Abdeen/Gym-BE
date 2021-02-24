const express = require("express");
const passport = require("passport");
const {
  gymList,
  gymCreate,
  classCreate,
  fetchGym,
} = require("../controllers/gymControllers");
// const upload = require("../middleware/multer");
const router = express.Router();

router.param("gymId", async (req, res, next, gymId) => {
  const gym = await fetchGym(gymId, next);
  if (gym) {
    req.gym = gym;
    next();
  } else {
    next({
      status: 404,
      message: "Gym Not Found",
    });
  }
});

router.get("/", gymList);

router.post(
  "/",
  //   upload.single("image"),
  gymCreate
);

router.post(
  "/:gymId/classes",
  //   upload.single("image"),
  classCreate
);

module.exports = router;
