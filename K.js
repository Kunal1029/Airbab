const express =  require('express');
const app = express();

app.use((req,res, next)=>{
    console.log("1st Middleware")
    next();
});

app.use((req,res, next)=>{
    console.log("2nd MiddleWare")
   // res.send("I won't let run any other route or MW by just ending req,res cycle hehehe")
    next();
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