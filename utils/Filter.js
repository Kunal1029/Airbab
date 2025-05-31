const Listing = require("../models/listing.js")

const showDeleteAndEditToOwnerOnly = async (req,res,next) => {
    const Onelisting = await Listing.findById(id).populate("reviews").populate("owner");
    if(Onelisting.owner._id === currentUser._id){
        console.log("hiii")
    }
    next()
}