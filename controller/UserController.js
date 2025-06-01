const passport = require("passport");
const userModel = require("../models/User.js");

module.exports.signUpPage =  (req, res) => {
    res.render("user/signUp.ejs");
  }

  module.exports.signUp = async (req, res, next) => {
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
  }

  module.exports.loginPage = (req, res) => {
    res.render("user/signIn.ejs");
  }

  module.exports.login =  async (req, res) => {
    req.flash("success", "Welcom to Airbnb! Login Successfully");
    let redirects = res.locals.currUrl || "/api/list";
    res.redirect(redirects);
  }

  module.exports.logout =  (req, res, next) => {
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
  }