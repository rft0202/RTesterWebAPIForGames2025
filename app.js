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

const mongoURI = "mongodb://localhost:2707/favfood"; //set up mongoDB connection
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
        const food = await Food.find();
        res.json(food);
    } catch(err){
        res.status(500).json({error:"Failed to get food."});
    }
});

app.listen(port, ()=>{ //start server
    console.log(`Server is running on port ${port}`);
})



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