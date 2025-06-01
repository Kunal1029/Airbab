//commiting this file in another branch "learning"

const { error } = require('console');
const express =  require('express');
const app = express();

// app.use((req,res, next)=>{
//     console.log("1st Middleware")
//     next();
// });

// app.use((req,res, next)=>{
//     console.log("2nd MiddleWare")
//    // res.send("I won't let run any other route or MW by just ending req,res cycle hehehe")
//     next();
// })

app.use((req,res,next)=>{
    req.time = Date.now();
    console.log(req.method, req.hostname, req.path, req.time)
    next();
})

//MW for data route privacy
app.use("/data",(req,res,next)=>{
    let {token} = req.query;
    if(token === "ps"){
        console.log(req.query)
        next()
    }
    res.send("Access Denied 1")
    
})

//MW for data route privacy with varible which can be use directly in many routes and multuple times
const tokenCheck = (req,res,next)=>{
    let {token} = req.query;
    if(token === "ps"){
        console.log(req.query)
        next()
    }
    throw new Error("Sorry! Access Denied")
};

app.get("/data", tokenCheck ,(req,res)=>{
    res.send("My Data") // only show when - http://localhost:8000/data?token=ps
})


app.get("/",(req,res)=>{ //app.reqType(path,(req,res)=>{some task})
    res.send("Root dir")
})

app.get("/hmm",(req,res)=>{ //app.reqType(path,(req,res)=>{some task})
    res.send("Random path")
})

app.use((req,res,next)=>{
    console.log("3rd MiddleWare")
    next();
})

app.get("/yup",(req,res)=>{ //
    res.send("YUP")
})

app.listen(8000,()=>{
    console.log("Port run")
})