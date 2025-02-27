const mongoose = require("mongoose");

const highScoreSchema = new mongoose.Schema({
    name:{type:String, required:true}, //object that sets up the different parameters
    highscore:{type:Number, required:true}
});

const HighScore = mongoose.model("HighScore", highScoreSchema, "highscores"); //name, schema, ?

module.exports = HighScore;