const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override");
const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust2";
const engine = require("ejs-mate")

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
app.use(express.static(path.join(__dirname,"/public")))

app.get("/", (req, res) => {
    res.send("Hi")
})

//index routes
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
})


//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})


//show route
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const Onelisting = await Listing.findById(id);
    res.render("listings/show.ejs", { Onelisting });
})


//create route 
app.post("/addlistings", async (req,res)=>{
    // let {title, description , image, price, country, location} = req.body;

    let newListing = new Listing(req.body.list);
    await newListing.save();
    res.redirect("/listings");
})

//edit route
app.get("/edit/:id", async (req,res)=>{
    let id = req.params.id;
    let data = await Listing.findById(id)
    res.render("listings/edit.ejs", {data})
})

//update
app.put("/updatelisting/:id", async (req,res)=>{
    let id = req.params.id;
    let data = req.body.list;
    await Listing.findByIdAndUpdate(id, {...req.body.list});
    res.redirect(`/listings/${id}`);
})

//delete
app.delete("/delete/:id", async (req,res)=>{
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
})

app.get("/checkingFunction", (req, res) => {
    // (async()=>{
    //     try {
    //         const data = await Listing.find({});
    //         res.send(data);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // })(); //immediately invoked function expression

    const ks = async () => {
        const data = await Listing.find({});
        res.send(data);
    }

    ks();
})

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

