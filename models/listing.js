const mongoose = require("mongoose")
const schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new schema({
    title: {
        type: String,
        
        set: v => v.trim()
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://assets.cntraveller.in/photos/67060b030871a221e9f6bd88/3:2/w_5004,h_3336,c_limit/GettyImages-520120864.jpg",
            set: (v) => v === "" ? "https://assets.cntraveller.in/photos/67060b030871a221e9f6bd88/3:2/w_5004,h_3336,c_limit/GettyImages-520120864.jpg" : v
        }
    },
    price: Number,
    location: String,
    country: {
        type: String,
        set: v => v.toUpperCase()
    },
    reviews:[{
        type: schema.Types.ObjectID,
        ref: "Review"
    }],
    owner:{
        type: schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing){
     await Review.deleteMany({_id : {$in : listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;
