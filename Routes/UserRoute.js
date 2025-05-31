const express = require("express");
const router = express.Router();
const userModel = require("../models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {redirectUrl} = require("../middleware.js")

router.get("/signup", (req, res) => {
  res.render("user/signUp.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let userMail = new userModel({
        username: username,
        email: email,
      });
      let userRegister = await userModel.register(userMail, password);
      console.log(userRegister);

      //user automatic login after signup
      req.login(userRegister, (err) => {
        if (err) {
          return next(err)
        }
        req.flash("success", "Register Successfully");
        res.redirect("/api/list");
      })

    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/signIn.ejs");
});

router.post(
  "/login", redirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcom to Airbnb! Login Successfully");
    let redirects = res.locals.currUrl || "/api/list";
    res.redirect(redirects);
  }
);

router.get("/logout", (req, res, next) => {
  if(!req.isAuthenticated()){
    req.flash("error", "Please login again");
    return res.redirect("/login")
  }
  if (!req.user) { //passport automatically store info about user in req.user
    req.flash("error", "You are already logout");
    return res.redirect("/login")
  }

  req.logout((err) => { //req.logout is passport method for logout feature which use serialized/deserialised to remove/empty user session.
    if (err) {
      next(err)
    }
    req.flash("success", "logged out")
    res.redirect("/login")
  })
})

module.exports = router;
