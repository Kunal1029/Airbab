const mongoose = require("mongoose");
const initdata= require("./data.js");
const Listing = require("../models/listing.js")

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust2";

main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(mongoUrl);
}

const initDB = async() =>{
    await Listing.deleteMany({})
    await Listing.insertMany(initdata.data)
    console.log("data was initialise")
}

initDB();