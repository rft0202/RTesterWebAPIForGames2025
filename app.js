const express = require("express"); //hosts server
const path = require("path"); 
const mongoose = require("mongoose"); //interface with mongoDB
const bodyParser = require("body-parser"); //parses JSON

const app = express();
const port = 3000; //port on computer that we will be using to communicate to the outside

//Serve Static Data (data that won't change)
app.use(express.static(path.join(__dirname, "public"))); //app.use: tell node application what it can use //express.static: declare static directory
//*4

//Middleware
app.use(bodyParser.json()); //to parse JSON requests
//*2
app.use(express.urlencoded({extended:true}));

const mongoURI = "mongodb://localhost:27017/data"; //set up mongoDB connection
mongoose.connect(mongoURI);

const db = mongoose.connection;

//Check if DB is running
db.on("error", console.error.bind(console, "MongoDB connection error")); 
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});

//Template for the data being received
const foodSchema = new mongoose.Schema({
    rank: Number, food: String
});

const Food = mongoose.model("Food", foodSchema, "favfood"); //schema, name of collection

//Read Routes (GET)
app.get("/", (req,res)=>{
    res.sendFile("index.html");
});

app.get("/food", async (req, res)=>{
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch(err){
        res.status(500).json({error:"Failed to get food."});
    }
});

app.listen(port, ()=>{ //start server
    console.log(`Server is running on port ${port}`);
})

//Create Route (POST)
//Add to list
//*3
app.post("/addfood", async (req, res)=>{
    try{
        const newFood = new Food(req.body);
        const saveFood = await newFood.save();
        res.redirect("/");
    } catch(err){
        res.status(500).json({error:"Failed to add food"});
    }
});

//Update Route (PUT)
app.put("/updatefood/:id", (req,res)=>{
    Food.findByIdAndUpdate(req.params.id, req.body, { //id, request body
        new:true, //is a new request
        runValidators:true 
    }).then((updatedFood)=>{ //if it completes, then (automatically pass into promise statement)
        if(!updatedFood){
            return res.status(404).json({error:"Failed to find the food."});
        }
        res.json(updatedFood); //update
        res.redirect("/");
    }).catch((err)=>{ //function call
        res.status(400).json({error:"Failed to update the food."}); 
    }); 
});

//Delete Route (DELETE)
app.delete("/deletefood/rank", async (req,res)=>{
    try{
        const foodname = req.query; //query request
        const food = await Food.find(foodname); //find using the query

        if(food.length === 0){ //=== means exactly equal to (the data type matches)
            return res.status(404).json({error:"Failed to find the food."}); 
        } 

        const deletedFood = await Food.findOneAndDelete(foodname);
        res.json({message: "Food deleted successfully."});
        res.redirect("/");
    }catch(err){
        console.log(err);
        res.status(404).json({error:"Food not found."}); 
    }
}); 

// //Our first example Route
// app.get("/", function(req, res){ //app.get([endpoint], callback function(request, response))
//     //res.send("Hello everyone!"); //serve a string
//     res.sendFile(path.join(__dirname, "public", "index.html")); //serve a webpage
// });

// //Route using games.json
// app.get("/testjson", (req, res)=>{ //()=> means anonymous function
//     res.sendFile(path.join(__dirname, "public", "json/games.json"))
// });

// //spin the server?
// app.listen(port, function(){
//     console.log(`Server is running on port: ${port}`); //string literal
// }); //port, callback function (anonymous function that will trigger things)