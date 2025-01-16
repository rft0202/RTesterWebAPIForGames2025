const express = require("express");
const path = require("path");

const app = express();
const port = 3000; //port on computer that we will be using to communicate to the outside

//Middleware to Serve Static Data (data that won't change)
app.use(express.static(path.join(__dirname, "public"))); //app.use: tell node application what it can use //express.static: declare static directory

let message = "Wouldn't you like to be a pepper too???";

function sendMessage()
{
    console.log(message);
}

//sendMessage();

//Our first example Route
app.get("/", function(req, res){ //app.get([endpoint], callback function(request, response))
    //res.send("Hello everyone!"); //serve a string
    res.sendFile(path.join(__dirname, "public", "index.html")); //serve a webpage
});

//Route using games.json
app.get("/testjson", (req, res)=>{ //()=> means anonymous function
    res.sendFile(path.join(__dirname, "public", "json/games.json"))
});

//Sending Status Codes
app.get("/statuscode", (req, res)=>{ //localhost:3000/statuscode
    res.sendStatus(200); //sends fake status codes //OK
    res.sendStatus(404); //page not found
    res.sendStatus(500); //internal server error
});

//Node can run more than one function at the same time, which can cause race condition, a common issue with Node
setTimeout(()=>{
    console.log("Hello 2 seconds later")
}, 2000);

setTimeout(()=>{
    console.log("Hello now")
}, 0);

//spin the server?
app.listen(port, function(){
    console.log(`Server is running on port: ${port}`); //string literal
}); //port, callback function (anonymous function that will trigger things)