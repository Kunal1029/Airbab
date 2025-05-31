const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const plm = require("passport-local-mongoose")

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
})

userSchema.plugin(plm); //it will automatically generate username, hasing, salting, hashpassword
module.exports = mongoose.model("User",userSchema)
