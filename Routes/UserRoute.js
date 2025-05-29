const express = require("express");
const router = express.Router();
const userModel = require("../models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("user/signUp.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let userMail = new userModel({
            username: username,
            email: email
        })
        let userRegister = await userModel.register(userMail, password);
        console.log(userRegister);
        req.flash("success", "Register Successfully")
        res.redirect("/login")
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/signup")
    }
}))

router.get("/login", (req, res) => {
    res.render("user/signIn.ejs")
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    req.flash("success", "Welcom to Airbnb! Login Successfully")
    res.redirect("/api/list")
})

module.exports = router;