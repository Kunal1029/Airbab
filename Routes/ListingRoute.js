const express = require("express");
const Lrouter = express.Router();
const ListingController = require("../controller/ListingController.js")
const {
  wrapAsync,
  ExpressError,
  validateListing,
} = require("../utils/CommonFile.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

//index routes
Lrouter.get(
  "/",
  wrapAsync(ListingController.index)
); //If an error hrouterens inside an async route handler without a try/catch or wrapAsync, the error won’t be passed to Express’s error middleware, and your router might crash or hang.

//new route
Lrouter.get("/new", isLoggedIn, ListingController.newList);

//show route
Lrouter.get("/show/:id", isLoggedIn, wrapAsync(ListingController.show));

//edit route
Lrouter.get("/edit/:id", isLoggedIn, isOwner, wrapAsync(ListingController.editList));

//create route
Lrouter.post(
  "/addlistings",
  isLoggedIn,
  validateListing,
  wrapAsync(ListingController.addNewList)
);

//update
Lrouter.put(
  "/updatelisting/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(ListingController.updateOne)
);

//delete
Lrouter.delete(
  "/delete/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.deleteOneList)
);

module.exports = Lrouter;
