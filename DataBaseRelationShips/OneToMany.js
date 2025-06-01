//commiting this file in another branch "learning"
const { number } = require("joi");
const mongoose = require("mongoose")
const { Schema } = mongoose;

// console.log(typeof mongoose) - Db connected

main()
.then(() => console.log("Db Connected"))
.catch((err) => console.log(err))

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/DB_RelationShips")
}



const orderSchema = new Schema({
    item:String,
    price: Number
})

const Order = mongoose.model("orders",orderSchema);

const addOrder = async ()=>{
    let myorder = await Order.insertMany([
        {item: "Apple",price:80},
        {item: "banana",price:30},
        {item: "kiwi",price:50}
    ])

    console.log(myorder)
}

// addOrder()


const customerSchema = new Schema({
    name: String,
    orders:[
        {
            type: Schema.Types.ObjectId,
            ref: "orders" //model of other schema becoms ref
        }
    ]
})

const CS = mongoose.model("OneToMany",customerSchema)

const addCustomer = async()=>{
    let cust1 = new CS({
        name:"LA"
    })

    let o1 = await Order.findOne({item: "Apple"})
    let o2 = await Order.findOne({price: 30})

    cust1.orders.push(o1);
    cust1.orders.push(o2);

    let c = await cust1.save();
    console.log(c)
}

// addCustomer();

let findCust = async () => {
    let result = await CS.find({}).populate("Order");
    console.log(result);
};

findCust()
