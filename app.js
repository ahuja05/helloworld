const express = require("express");
const app =express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connection successful to db")
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}


app.get("/", (req,res)=>{
    res.send("Hi, I am root")
})

//INDEX ROUTE                   <a> is used so that when user clicks it redirects to another page
app.get("/listings", async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});   
});


// NEW/CREATE ROUTE
app.get("/listings/new" ,(req,res)=>{
    res.render("listings/new.ejs")
})

//CREATE ROUTE
app.post("/listings", async (req,res)=>{
    // let {title,description,image,price,location,country} = req.body;
    let listing = req.body.listing;       //we changed the name in form to listing[]
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings")


});


//EDIT ROUTE 
app.get("/listings/:id/edit", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
});


//UPDATE ROUTE
app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
})


//SHOW ROUTE
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})

});


//DELETE ROUTE
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})


// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 12000,
//         location: "Calangute,Goa",
//         country: "India",
//     });

//     await sampleListing.save()
//     console.log("sample was saved");
//     res.send("successful testing")
// })

app.listen(9000,()=>{
    console.log("server is listening to port 9000");
})


