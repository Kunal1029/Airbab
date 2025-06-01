const Express = require("express");
const Rrouter = Express.Router({mergeParams: true}); 
const {wrapAsync ,  validateReview} = require("../utils/CommonFile.js")
const { isLoggedIn , isAuthorReview} = require("../middleware.js")
const ReviewController = require("../controller/ReviewController.js")


//Reviews routes
Rrouter.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.AddReview));

Rrouter.delete("/:reviewId", isLoggedIn, isAuthorReview, wrapAsync(ReviewController.deleteOneReview))


module.exports = Rrouter;

