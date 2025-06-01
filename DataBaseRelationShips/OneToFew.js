//commiting this file in another branch "learning"
const mongoose = require("mongoose");
const { Schema } = mongoose;

main()
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => console.log(err))

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/DB_RelationShips")
}

const userSchema = new Schema({
    username : String,
    address : [
        {
            _id: false,
            location: String,
            city: String
        }
    ]
});


const User = mongoose.model("OneToFew", userSchema);

const u1 = async ()=>{
    let U1 = new User({
        username: "KS",
        address: [
            {
                location:"L1",
                city: "C1"
            }
        ]
    })
    U1.address.push({location:"L2",city:"C2"})
    let result = await U1.save();
    console.log(result)
}

u1();