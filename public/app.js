var app = angular.module("kayak",["ngResource"]);


// --- Controllers ---


app.controller('PostController', ['$scope',"$resource","$http","$rootScope",function($scope,$resource,$http,$rootScope) {

  $scope.active = true;
  $scope.postBoard = "Ottawa";

  var Post = $resource("/api/posts");

  Post.query(function(results){
    $scope.posts = results.reverse();
  });

  $scope.createPost = function(){

    var post = new Post();

    post.content = $scope.postContent;
    post.board = $scope.postBoard;
    post.score = 0;

    post.$save(function(result){
      $scope.posts.unshift(result);
      $scope.postContent = "";
    });

  }

  $scope.updateScore = function(id,newscore,upvote){

    $http.put("/api/posts/"+id,{score:newscore,user:$rootScope.currentUser.username,upvote:upvote});

  }

  $scope.getUser = function(){
    $http.get("/loggedin").then(function(res){
      $rootScope.currentUser = res.data;
    });
  }

  $scope.getUser();

  $scope.toggleLike = function(post,liked){

    $scope.updateScore(post._id,post.likedby.length,liked);

  }

}]);


app.controller("LoginController",["$scope","$http","$rootScope",function($scope,$http,$rootScope){

  $scope.login = function(user){

    $http.post("/login",user)
    .success(function(res){
      console.log(res);
      $rootScope.currentUser = user;
    });

  }

  $scope.logout = function(){

    $http.post("/logout").success(function(){
      $rootScope.currentUser = null;
      $location.url("/home");
    });

    location.reload();

  }

}]);


app.controller("RegisterController",["$scope","$http","$rootScope",function($scope,$http,$rootScope){

  $scope.register = function(user){
    //TODO: notify user if passwords are different

    if(user.password == user.password2){
      $http.post("/register",user)
      .success(function(res){
        $rootScope.currentUser = user;
        console.log(res);
      });
    }

  }

}]);



// Controller for taglines in the Jumbotron
app.controller("QuoteController",["$scope",function($scope){

  // Returns a random tagline from the quotes array.
  $scope.getQuote = function(){

    var quotes = [
      "Views from Vanier",
      "Ottawa's Very Own",
      "Repping L-Town",
      "Waiting for the canal to open",
      "We get to ride the O-Train"
    ];

    // index is a random float (between 0 and quotes.length) floored to an int.
    var index = Math.floor(Math.random()*quotes.length);
    return quotes[index];

  }

  $scope.tagline = $scope.getQuote();

}]);



// --- Directives ---


app.directive("postsView",function(){

  return{
    templateUrl: "/directives/posts-view.html",
    restrict:"E"
  }

});

app.directive("newPost",function(){

  return{
    templateUrl: "/directives/new-post.html",
    restrict:"E"
  }

});

app.directive("signIn",function(){

  return{
    templateUrl: "/directives/sign-in.html",
    restrict:"E"
  }

});

app.directive("register",function(){

  return{
    templateUrl: "/directives/register.html",
    restrict:"E"
  }

});
