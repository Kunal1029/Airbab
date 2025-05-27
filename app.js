const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override");
const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust2";
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema")
const Review = require("./models/review.js")

main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(mongoUrl);
}

// I will use EJS templates(blueprint (which contains html + variable)) to render my HTML pages.
app.set("view engine", "ejs"); //ejs (embedded javascript) - Embedded means inserted or placed inside something else
app.set("views", path.join(__dirname, "views"));
// "My EJS files (templates) are stored inside the views folder."
// __dirname = current folder (where your app.js or server.js is).
// path.join(__dirname, "views") = full path to your views folder.

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")))

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

app.get("/", (req, res) => {
    res.send("Hi")
})

//index routes
app.get("/api/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))  //If an error happens inside an async route handler without a try/catch or wrapAsync, the error won’t be passed to Express’s error middleware, and your app might crash or hang.

//new route
app.get("/api/listings/new", (req, res, next) => {
    // res.render("listings/new.ejs");
    res.render("listings/new.ejs", (err, html) => {
        if (err) {
            return next(new ExpressError("Failed to render page", 300)); // pass to error handler
        } else {
            res.send(html);
        }
    });
})

//show route
app.get("/api/listings/:id", async (req, res) => {
    const { id } = req.params;
    const Onelisting = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { Onelisting });
})

//edit route
app.get("/api/edit/:id", async (req, res) => {
    let id = req.params.id;
    let data = await Listing.findById(id)
    res.render("listings/edit.ejs", { data })
})

//create route 
app.post("/api/addlistings", validateListing, wrapAsync(async (req, res, next) => {
    // let {title, description , image, price, country, location} = req.body;
    // if(!req.body.list){
    //     throw new ExpressError(400, "Send Valid data for listings")
    // } //this only make sure at least one field should present only
    // console.log(req.body)
    // let validateSchemaError = listingSchema.validate(req.body); //x-www-form-urlencoded (Postman) - api runs in this only
    // // console.log(validateSchemaError) // this will show error and field which is not present
    // if(validateSchemaError.error){
    //     throw new ExpressError(400, validateSchemaError.error)
    // }
    const newListing = new Listing(req.body.list);
    await newListing.save();
    res.redirect("/api/listings");

}))

//update
app.put("/api/updatelisting/:id", validateListing, wrapAsync(async (req, res) => {
    let id = req.params.id;
    // let data = req.body.list;
    await Listing.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/api/listings/${id}`);
}))

//delete
app.delete("/api/delete/:id", wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/api/listings")
}));

//Reviews routes
app.post("/api/listing/:id/review", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)

    await newReview.save();
    await listing.save();

    res.redirect(`/api/listings/${req.params.id}`)
}));

app.delete("/api/listing/:id/review/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/api/listings/${id}`)
    // alert(req.params)
}))

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
});

app.use((err, req, res, next) => {
    // console.log(err)
    let { statusCode = 500, message = "Something went Wrong!" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("Error.ejs", { err })
    // res.send("Something went Wrong -> ", kunal)
})

// //this is for empty route or invalid route
// app.use((req, res) => {
//     res.send("Something went Wrong, Invalid route")
// })

// app.get("/checkingFunction", (req, res) => {
//     // (async()=>{
//     //     try {
//     //         const data = await Listing.find({});
//     //         res.send(data);
//     //     } catch (error) {
//     //         console.log(error)
//     //     }
//     // })(); //immediately invoked function expression

//     const ks = async () => {
//         const data = await Listing.find({});
//         res.send(data);
//     }

//     ks();
// })

// app.get("/listings", async (req, res) => {
//     const data = await Listing.find({});
//     console.log(data)
//     res.send(data);
// });


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "New one",
//         description: "New Des",
//         price:120,
//         location: "Vin",
//         country: "Endia"
//     })

//     await sampleListing.save();
//     console.log("sample was saved")
//     res.send(sampleListing)
// })

app.listen(8080, () => {
    console.log("App started port 8080")
})

