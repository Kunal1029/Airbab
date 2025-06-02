const express = require("express");
const Lrouter = express.Router();
const ListingController = require("../controller/ListingController.js")
const {
  wrapAsync,
  ExpressError,
  validateListing,
} = require("../utils/CommonFile.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const multer = require("multer") //require, we using multer for parsing form data of filetype.
const { storage } = require("../cloudConfig.js");
// const uploadTo = multer({dest: 'myfiletype/'}) //initialize, multer fetch files data from forms and automatically create folder 'myfiletype' for saving our file/image.
const uploadTo = multer({storage}) 

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
  uploadTo.single("list[image]"),
  validateListing,
  wrapAsync(ListingController.addNewList)
);

//image upload to clodinary test or practice
// Lrouter.post("/addlistings",uploadTo.single("list[image]"),  (req,res)=>{ 
//   console.log(req.file)
//   res.send(JSON.stringify(req.body) + " ~~~~~~~ " + JSON.stringify(req.file));
// })

//update

Lrouter.put(
  "/updatelisting/:id",
  isLoggedIn,
  isOwner,
  uploadTo.single("list[image]"),
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
