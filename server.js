var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Post = require("./public/models/post");
var User = require("./public/models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");
var cookieParser = require("cookie-parser");

var app = express();

// Connecting to mongoose through mongodb.
mongoose.connect("mongodb://localhost:27017/kayak");

// More stuff/middleware we need for our project.
app.use(bodyParser());
app.use(express.static(__dirname+"/public/"));
app.use(session({secret:"OVO"}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


// Configuring our login strategy for Passport
passport.use(new LocalStrategy(function(username,password,done){

  User.findOne({username:username,password:password},function(err,result){

    // If a user is found with the specified username and password
    if(result){
      return done(null,result);
    }

    // If no user is found
    else{
      return done(null,false,{message:"Can't login"});
    }

  });

}));


passport.serializeUser(function(user,done){
  done(null,user);
});

passport.deserializeUser(function(user,done){
  done(null,user);
});




// --------- Home page route ---------


// If a user hits the home page, send index.
app.get("/",function(req,res){
  res.sendFile(__dirname+"/public/index.html");
});



// --------- User authentication routes ---------

app.post("/login",passport.authenticate("local"),function(req,res){
  res.json(req.body);
});

app.post("/logout",function(req,res){
  req.logout();
  res.sendStatus(200);
});


// Checks if a user is logged in
app.get("/loggedin",function(req,res){

  var check;

  if(req.isAuthenticated()){
    check = req.user;
  }

  else{
    check = null;
  }

  res.send(check);
  res.end();

});

// Register/Create a new user
app.post("/register",function(req,res){

  User.findOne({username:req.body.username},function(err,user){

    // If the user exists, return null.
    if(user){
      res.json(null);
      return;
    }

    // If that user doesn't exist, create him.
    else{

      var newUser = new User(req.body);

      newUser.save(function(err,user){

        req.login(user,function(err){

          if(err){
            return next(err);
          }

          res.json(user);

        });
      });
    }
  });
});


// --------- Post related routes ---------


// GET request returns every single post.
// TODO: implement a way to receive ~30 posts if the database gets too big.
app.get("/api/posts",function(req,res){
  Post.find({},function(err,posts){
    res.json(posts);
  });
});

// POST adds user post to database.
app.post("/api/posts",function(req,res){

  var post = new Post(req.body);

  post.save(function(err,result){
    res.json(result);
  });

});

// PUT updates the score of a post
app.put("/api/posts/:id",function(req,res){

  // findByIdAndUpdate arguments are id of the document to update, data to update, options, and callback function.
  Post.findByIdAndUpdate(req.params.id,{score:req.body.score},{new:true},function(err,result){});

  if(req.body.upvote == true){
    Post.findByIdAndUpdate(req.params.id,{$push: {"likedby": req.body.user}},{new:true},function(err,result){});
  }

  else{
    Post.findByIdAndUpdate(req.params.id,{$pull: {"likedby": req.body.user}},{new:true},function(err,result){});
  }

});



// --------- Start the server ---------

app.listen(4000,function(){
  console.log("Server running on port 4000");
});
