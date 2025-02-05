const express = require("express"); //express as middleware for hosting the server
const mongoose = require("mongoose"); //another middleware that makes it easier to interface with a mongoDB database
const bodyParser = require("body-parser"); //takes the body of the HTML or JSON document and parses it so we can use the data
const path = require("path"); //part of express
//Added - Login
//*6
const session = require("express-session");
const bcrypt = require("bcryptjs");

function isAuthenticated(req,res,next){
    if(req.session.user) document.getElementById("Login").innerHTML = "<a href='/logout'>Logout</a>"
    else document.getElementById("Login").innerHTML = "<a href='login.html'>Login</a>"
}

isAuthenticated();