const Listing = require("./models/listing.js")
const Review = require("./models/review.js")

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.originalUrl) // user is method which contain data of request body, it is seperated from passport
    if(!req.isAuthenticated()){ //this is passport method to check authentication, know more..
        req.session.redirectMe = req.originalUrl;
        req.flash("error","Please Logged in")
        return res.redirect("/login");
    }

    return next();
}

module.exports.redirectUrl = (req,res,next)=>{
    if(req.session.redirectMe){
        res.locals.currUrl = req.session.redirectMe;
        delete req.session.redirectMe;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    const {id} = req.params;
    const lst = await Listing.findById(id).populate("owner")
    if(!res.locals.currentUser._id.equals(lst.owner._id)){
        req.flash("error","You don't have permission to do this task")
        return res.redirect(`/api/list/show/${id}`)
    }
    next();

}
module.exports.isAuthorReview = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(!res.locals.currentUser._id.equals(review.author._id)){
        req.flash("error","You don't have permission to do this task")
        return res.redirect(`/api/list/show/${id}`)
    }
    next();

}