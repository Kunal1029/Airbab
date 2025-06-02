const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}).populate("owner");
    res.render("listings/index.ejs", { allListings });
}

module.exports.newList = (req, res, next) => {
    // res.render("listings/new.ejs");
    res.render("listings/new.ejs", (err, html) => {
        if (err) {
            return next(new ExpressError("Failed to render page", 300)); // pass to error handler
        } else {
            res.send(html);
        }
    });
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const Onelisting = await Listing.findById(id)
        .populate("owner")
        .populate({ path: "reviews", populate: { path: "author" } });
    console.log(Onelisting);
    if (!Onelisting) {
        req.flash("error", "Listing Doesn't exist.");
        res.redirect("/api/list");
    }
    // console.log(Onelisting)
    res.render("listings/show.ejs", { Onelisting });
}

module.exports.editList = async (req, res) => {
    let id = req.params.id;
    let data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "Listing Doesn't exist.");
        res.redirect("/api/list");
    }
    res.render("listings/edit.ejs", { data });
}

module.exports.addNewList = async (req, res, next) => {
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
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url + " "+ filename)
    const newListing = new Listing(req.body.list);
    // console.log(req.user);
    newListing.owner = req.user._id; //we need to also save owner details who created post.
    newListing.image = {url, filename}
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/api/list");
}

module.exports.updateOne = async (req, res) => {
    let id = req.params.id;
    // let data = req.body.list;
    let listingEdit = await Listing.findByIdAndUpdate(id, { ...req.body.list });

    if (req.file) {
        let url = req.file.path || req.file.url; // Cloudinary might use `path`
        let filename = req.file.filename;
        listingEdit.image = { url, filename };
    }

    await listingEdit.save();

    req.flash("success", `Listing Edit Successfully`);
    res.redirect(`/api/list/show/${id}`);
}

module.exports.deleteOneList = async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", `Listing Deleted Successfully`);
    res.redirect("/api/list");
}