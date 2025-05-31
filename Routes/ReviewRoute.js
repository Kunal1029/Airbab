const Express = require("express");
const Rrouter = Express.Router({mergeParams: true}); 
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const {wrapAsync ,  validateReview} = require("../utils/CommonFile.js")
const { isLoggedIn} = require("../middleware.js")


//Reviews routes
Rrouter.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)

    await newReview.save();
    await listing.save();

    req.flash("success","Thanks for your comment!")
    res.redirect(`/api/list/show/${req.params.id}`)
}));

Rrouter.delete("/:reviewId", isLoggedIn, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/api/list/show/${id}`)
    // alert(req.params)
}))


module.exports = Rrouter;

