const express = require("express");
const Lrouter = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  wrapAsync,
  ExpressError,
  validateListing,
} = require("../utils/CommonFile.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

//index routes
Lrouter.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}).populate("owner");
    res.render("listings/index.ejs", { allListings });
  })
); //If an error hrouterens inside an async route handler without a try/catch or wrapAsync, the error won’t be passed to Express’s error middleware, and your router might crash or hang.

//new route
Lrouter.get("/new", isLoggedIn, (req, res, next) => {
  // res.render("listings/new.ejs");
  res.render("listings/new.ejs", (err, html) => {
    if (err) {
      return next(new ExpressError("Failed to render page", 300)); // pass to error handler
    } else {
      res.send(html);
    }
  });
});

//show route
Lrouter.get("/show/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const Onelisting = await Listing.findById(id)
    .populate("owner")
    .populate({ path: "reviews", populate: { path: "author" } });
  console.log(Onelisting);
  if (!Onelisting) {
    req.flash("error", "Listing Doesn't exist.");
    res.redirect("/api/list");
  }
  // console.log(Onelisting)
  res.render("listings/show.ejs", { Onelisting });
});

//edit route
Lrouter.get("/edit/:id", isLoggedIn, isOwner, async (req, res) => {
  let id = req.params.id;
  let data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing Doesn't exist.");
    res.redirect("/api/list");
  }
  res.render("listings/edit.ejs", { data });
});

//create route
Lrouter.post(
  "/addlistings",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let {title, description , image, price, country, location} = req.body;
    // if(!req.body.list){
    //     throw new ExpressError(400, "Send Valid data for listings")
    // } //this only make sure at least one field should present only
    // console.log(req.body)
    // let validateSchemaError = listingSchema.validate(req.body); //x-www-form-urlencoded (Postman) - api runs in this only
    // // console.log(validateSchemaError) // this will show error and field which is not present
    // if(validateSchemaError.error){
    //     throw new ExpressError(400, validateSchemaError.error)
    // }
    const newListing = new Listing(req.body.list);
    console.log(req.user);
    newListing.owner = req.user._id; //we need to also save owner details who created post.
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/api/list");
  })
);

//update
Lrouter.put(
  "/updatelisting/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    // let data = req.body.list;
    await Listing.findByIdAndUpdate(id, { ...req.body.list });
    req.flash("success", `Listing Edit Successfully`);
    res.redirect(`/api/list/show/${id}`);
  })
);

//delete
Lrouter.delete(
  "/delete/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", `Listing Deleted Successfully`);
    res.redirect("/api/list");
  })
);

module.exports = Lrouter;
