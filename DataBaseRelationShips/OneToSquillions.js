//commiting this file in another branch "learning"
const mongoose = require("mongoose")
const { Schema } = mongoose;

main()
    .then(() => console.log("Db Connected"))
    .catch((err) => console.log(err))

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/DB_RelationShips");
}

const user = new Schema({
    name:String,
    email:String
})

const posts = new Schema({
    content: String,
    likes: Number,
    userDetails:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const User = mongoose.model("User",user);
const Post = mongoose.model("Post",posts);

const addata = async ()=>{
    let u1 = new User({
        name:"K",
        email: "k2@gmail.com"
    })

    await u1.save();

    let p1 = new Post({
        content:"Hi",
        likes: 22,
    })
    p1.userDetails=u1

    await u1.save();
    await p1.save();
}

// addata();

const addMore = async () =>{
    let u1 = await User.find({name: "K"});

    let p2 = new Post({
        content: "by",
        likes: 44,
        
    })
    p2.userDetails=u1._id
    await p2.save();
}

// addMore();

let dta = async () =>{
    let res = await Post.find({}).populate("userDetails");
console.log(res);
}
dta()