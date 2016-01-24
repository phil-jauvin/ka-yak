var mongoose = require("mongoose");

module.exports = mongoose.model("Post",{
  content: String,
  board: String,
  score: Number,
  likedby:[]
});
