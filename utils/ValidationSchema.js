const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require("./ExpressError.js")


const validateListing = (req, res, next) => { //this is mw for validation in form, client & server side both
    const { error } = listingSchema.validate(req.body); //x-www-form-urlencoded (Postman) - api runs in this only
    if (error) {
        let erroMsg = error.details.map((mp) => mp.message).join(",") // this is extraction of [[object]]
        throw new ExpressError(400, erroMsg)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let erroMsg = error.details.map((mp) => mp.message).join(",")
        throw new ExpressError(400, erroMsg)
    } else {
        next();
    }
}


module.exports ={
    validateListing,
    validateReview
}
