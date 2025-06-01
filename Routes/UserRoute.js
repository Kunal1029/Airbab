const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {redirectUrl} = require("../middleware.js")
const UserController = require("../controller/UserController.js")
const passport = require("passport");


router.get("/signup", UserController.signUpPage);

router.post(
  "/signup",
  wrapAsync(UserController.signUp)
);

router.get("/login", UserController.loginPage);

router.post(
  "/login", redirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  UserController.login
);

router.get("/logout", UserController.logout)

module.exports = router;
