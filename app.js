const express = require("express"); //hosts server
const path = require("path"); 
const mongoose = require("mongoose"); //interface with mongoDB
const bodyParser = require("body-parser"); //parses JSON
//Login
//*6
const session = require("express-session");
const bcrypt = require("bcryptjs");
//
//Registering Users
//*11
const User = require("./models/User");
//Added - Hide Sensitive Information
//*16
require("dotenv").config();

const app = express();
//const port = 3000; //port on computer that we will be using to communicate to the outside
const port = process.env.port||3000;

//Serve Static Data (data that won't change)
app.use(express.static(path.join(__dirname, "public"))); //app.use: tell node application what it can use //express.static: declare static directory
//*4

//Middleware
app.use(bodyParser.json()); //to parse JSON requests
//*2
app.use(express.urlencoded({extended:true}));

//Login
//*7
//Sets up session variable
app.use(session({
    //Hide Sensitive Information
    //secret: "12345",
    //*17
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false} //set to true if using https (aka have a ssl certificate)
}));

//Check Authentication
function isAuthenticated(req,res,next){
    if(req.session.user) return next(); //valid credentials, let them pass
    return res.redirect("/login"); //not valid credentials, redirect back to login page
};
//

//MongoDB connection setup
//const mongoURI = "mongodb://localhost:27017/data"; //set up mongoDB connection
//*15
//Added - Access non-local DB
//*18
//Added - Hide sensitive information
const mongoURI = process.env.MONGODB_URI;
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
        foods.sort((a,b)=>a.rank-b.rank);
        res.json(foods);
    } catch(err){
        res.status(500).json({error:"Failed to get food."});
    }
});

//Get by ID
app.get("/food/:id", async (req,res)=>{
    try{
        const food = await Food.findById(req.params.id);
        if(!food){
            return res.status(404).json({error:"Food not found."});
        }
        res.json(food);
    }catch(err){
        res.status(500).json({error:"Failed to get the food."});
    }
});

//Added - Login
//*8
app.get("/addtolist", isAuthenticated, (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "addtolist.html")); 
});

app.get("/update", isAuthenticated, (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "update.html")); 
});

app.get("/login", (req,res)=>{
    res.sendFile(path.join(__dirname + "/public/login.html"));
});

app.get("/checklogin", isAuthenticated, (req, res)=>{
    res.sendStatus(202);
});
//

//Added - Register user
//*12
app.get("/register", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.post("/register", async (req,res)=>{
    try{
        const {username, password, email} = req.body;

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.send("Username already taken. Try a different one");
        }

        const existingEmail = await User.findOne({email});

        if(existingEmail){
            return res.send("Email in use. Try a different one");
        }

        const hashedPassword = bcrypt.hashSync(password, 10); //Create hashed password //num is how encrypted you want it to be
        const newUser = new User({username, password:hashedPassword, email});
        await newUser.save();

        res.redirect("/login");

    }catch(err){
        res.status(500).send("Error registering new user.");
    }
});
//

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
app.post("/updatefood/:id", isAuthenticated, (req,res)=>{
    Food.findByIdAndUpdate(req.params.id, req.body, { //id, request body
        new:true, //is a new request
        runValidators:true 
    }).then((updatedFood)=>{ //if it completes, then (automatically pass into promise statement)
        if(!updatedFood){
            return res.status(404).json({error:"Failed to find the food."});
        }
        //res.json(updatedFood); //update
        res.redirect("/");
    }).catch((err)=>{ //function call
        res.status(400).json({error:"Failed to update the food."}); 
    }); 
});

//Added - Login
//*9 *14
app.post("/login", async (req, res)=>{
    const {username, password} = req.body;
    console.log(req.body);

    const user = await User.findOne({username});
    if(user && bcrypt.compareSync(password, user.password)){ //Check if password in db and inputted password match
        req.session.user = username;
        return res.redirect("/");
    }
    //Not valid login
    req.session.error = "Invalid User";
    return res.redirect("/login");
});

//Logout
app.get("/logout", (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/")
    });
});
//

//Delete Route (DELETE)
app.post("/deletefood/food", isAuthenticated, async (req,res)=>{
    try{
        const foodname = req.query; //query request
        const food = await Food.find(foodname); //find using the query

        if(food.length === 0){ //=== means exactly equal to (the data type matches)
            return res.status(404).json({error:"Failed to find the food."}); 
        } 

        const deletedFood = await Food.findOneAndDelete(foodname);
        //res.json({message: "Food deleted successfully."});
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