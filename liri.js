//Store dependencies in global variables
var keys = require("./keys.js"); /**twitterKeys**/
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");/**From the previous movies exercise**/
var fs = require("fs");

//Inform the user what to type
console.log("Type: my-tweets, spotify-song, movie-please, or directions-por-favor.")

//process.argv[2] = the action specified by the user
var userCommand = process.argv[2];
//process.argv[3] = is the search parameter
var search = process.argv[3];

//Process multiple words.  Will trigger if user types anything more than the first parameter
for(var i=4;i<process.argv.length; i++){
  search = search += "+" + process.argv[i];
}


//Creating the switch to go between each action and also which action to execute
function masterSearch(){
  switch (userCommand) {

    case "my-tweets":
      findTweets();
      break;

    case "spotify-song":
      spotifyNow();
      break;

    case "movie-please":
      movie();
      break;

    case "directions-por-favor":
      followDirections();
      break;
  }
}


/*****Twitter Area******/
function findTweets(){
  console.log("Here are your latest tweets from your twitter account");

  //Grab the keys from the keys.js file
  var clientTwitter = new twitter(keys);

  //get the most recent 10 tweets from the twitter account
  var parameters = {
    count:10
  };

  clientTwitter.get("status and timeline", parameters, function(error, tweets, response){
    if(!error){
      for(i=0; i<tweets.length; i++){
        var returnData = ("Number: " + (i+1) + "\n" + tweets[i].created_at + "\n" + tweets[i].text + "\n");
        console.log(returnData);
        console.log("--------------------------");
      }
    }
  });

}
/*****Twitter Area End******/



/*****Spotify Area**********/
function spotifyNow(){
  console.log("Now time for some music!");

  var searchMusic;
  if(search === undefined){
    console.log("Please try again"); //Cannot find user input
  }
  else{
    searchMusic = search; //Finds user input
  }

  spotify.search({type: "track", query: searchMusic}, function(err , data){
    if(err){
      console.log("Error occurred: " + err);
      return;
    } else if (data.error) {
      console.log("Error occurred: " + data);
      return;
    }

    else{
      console.dir(data);
      // console.log("Artist: " + data.tracks.items[0].artists[0].name);
      // console.log("Song: " + data.tracks.items[0].name);
      // console.log("Album: " + data.tracks.items[0].album.name);
      // console.log("Preview here: " + data.tracks.items[0].preview_url);
    }

  })

}
/*****Spotify Area End**********/



/******Movie Area**********/

function movie(){

 /**You can follow the in-class request exercise for this**/
  console.log("Movie Time!");

  var movieSearch;
  if(search === undefined){
    movieSearch = "Sharknado";
  }
  else{
    movieSearch = search;
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=40e9cece";
  console.log("movie time?");
  request((queryUrl), function(error,response,body){
    console.log("got hear");
    if(!error && response.statusCode === 200){
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors & Actresses: " + JSON.parse(body).Actors);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
      console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
    }
  });
}
/******Movie Area End**********/


/********TEXT FILE AREA*********/
function followDirections(){
  console.log("Looking at the txt file you created. Processing........");

  fs.readFile("random.txt", "utf8", function(error,data){
    if(error){
      console.log("Here is the error: " + error);
    }
    else{
      var dataArr = data.split(",");
      userCommand = dataArr[0];
      search = dataArr[1];

      //if multiword search
      for(i=2; i<data.Arr.length; i++){
        search= search + "+" + dataArr[i];
      }

      masterSearch();
    }
  })
}

masterSearch();
