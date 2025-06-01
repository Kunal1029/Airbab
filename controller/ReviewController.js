const Review = require("../models/review.js")
const Listing = require("../models/listing.js")

module.exports.AddReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    
    newReview.author = req.user._id;
    // console.log(newReview)
    listing.reviews.push(newReview)

    await newReview.save();
    await listing.save();

    req.flash("success","Thanks for your comment!")
    res.redirect(`/api/list/show/${req.params.id}`)
}

module.exports.deleteOneReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/api/list/show/${id}`)
    // alert(req.params)
}