const mongoose = require("mongoose")
const schema = mongoose.Schema;

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
    }
});

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;
