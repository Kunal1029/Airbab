const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const methodOverride = require("method-override");
const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust2";
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const Lrouter  = require("./Routes/ListingRoute.js")
const Rrouter  = require("./Routes/ReviewRoute.js")
const cookieParser = require("cookie-parser")

main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(mongoUrl);
}


app.use(cookieParser());
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


app.get("/", (req, res) => {
    res.send("Hi")
})

app.use("/api/list",Lrouter)
app.use("/api/review/:id/review",Rrouter)


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

