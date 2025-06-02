const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { redirectUrl } = require("../middleware.js")
const UserController = require("../controller/UserController.js")
const passport = require("passport");



//signup
router.route("/signup")
  .get(UserController.signUpPage)
  .post(wrapAsync(UserController.signUp));


//login
router.route("/login")
  .get(UserController.loginPage)
  .post(
    redirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    UserController.login
  )


router.get("/logout", UserController.logout)

module.exports = router;
