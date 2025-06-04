if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const methodOverride = require("method-override");
const mongoUrl = process.env.MONGO_URL;
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const Lrouter = require("./Routes/ListingRoute.js")
const Rrouter = require("./Routes/ReviewRoute.js")
const userRouter = require("./Routes/UserRoute.js")
const cookieParser = require("cookie-parser")
const serverSession = require("express-session");
const flash = require("connect-flash")
const passport = require("passport")
const localStrategyPass = require("passport-local")
const userSchema = require("./models/User.js");
const MongoStore = require("connect-mongo"); // ---------------------- use  for production session

main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(mongoUrl);
}

const store = MongoStore.create({
    mongoUrl: mongoUrl,
    crypto:{
        secret : process.env.Ssecret
    },
    touchAfter: 24 * 60 * 60,
})

store.on("error",()=>{
    console.log("Error in Mongo Session ",err)
})

const sessionOptions = {
    store, //mongo-connect
    secret: process.env.Ssecret,
    resave: false, 
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


app.use(serverSession(sessionOptions))
app.use(cookieParser()); 
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategyPass(userSchema.authenticate()))
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());


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


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user? req.user : "no-user";
    res.locals.isAuthenticate = req.isAuthenticated() ? "yes" : "no";
    return next();
})

app.get("/", (req, res) => {
    res.render("Welcome.ejs")
})

app.use("/", userRouter)
app.use("/api/list",Lrouter)
app.use("/api/review/:id/review",Rrouter)


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
});

app.use((err, req, res, next) => {
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

