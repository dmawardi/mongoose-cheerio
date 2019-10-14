// Import packages
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require db models
var db = require("./models");

// set port to 3000
var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Setup MongoDB URI to server if server run or local db if local instance run
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false });

// Routes
// A GET route for scraping the engadget website
app.get("/scrape", function(req, res) {
  // Grab the body of the html with axios
  axios.get("http://www.engadget.com/").then(function(response) {
    // Load the data into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);    

    // For each article tag
    $("article").each(function(i, element) {
      // Init an empty result object
      var result = {};

      // grab the required details from the page and store in results
      // Grab headline
      result.headline = $("div.th-title", this)
        .text().replace(/\n/g, '').trim();
      // Grab summary if exists
        result.summary = $("p", this)
        .text();

        // Grab link if exists
      result.link = $(this)
        .children("a")
        .attr("href");

        // If result link is not "#" and contains a value
        if (result.link && result.link !== "#") {
          // Check if record already exists
          db.Article.exists({ link: result.link }).then(function(exists){
            // If not, proceed to create
            if (!exists) {
              // Create a new Article
              db.Article.create(result)
                .then(function(dbArticle) {
                  // View the added result in the console
                  console.log("Created:", dbArticle);
                })
                .catch(function(err) {
                  // If an error occurred, log it
                  console.log(err);
                });
            }
          })

        }        
    });

    // Redirect user back to main page with newly scraped images now present
    res.redirect('/');
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Find all articles within db
  db.Article.find().then(function(data){
    // Send results to user
    res.json(data);
  }).catch(function(err){
    // Else, send error to user if caught
    res.json(err);
  })
});

// Route for grabbing a specific Article by id, populate with its comments
// (Used for adding new comment)
app.get("/articles/:id", function(req, res) {
  //Find one article using id from url parameter. Populate comments from comments collection
  db.Article.findOne({_id: req.params.id}).populate('comments').then(function(data){
    console.log('server', data);
    // Send article data to user
    res.json(data);

    // Else, send error to user if caught
  }).catch(function(err){
    res.json(err);
  })
});

// Route for grabbing an article's comments using article id
app.get("/comments/:id", function(req, res) {
  // Find single article's data and populate comments
  db.Article.findOne({_id: req.params.id}).populate('comments').exec().then(function(data){
    console.log('server', data);
    // Send to user the comments
    res.json(data.comments);

    // Else, send error to user if caught
  }).catch(function(err){
    res.json(err);
  })
});

// Route for grabbing article comments
app.get("/editComment/:id", function(req, res) {
  // Find single comment details by comment id
  db.Comment.findOne({_id: req.params.id}).then(function(data){
    console.log('server', data);
    // Send comment data to user
    res.json(data);

    // Else, send error to user if caught
  }).catch(function(err){
    res.json(err);
  })
});

// Route for creating a new comment (associated with an article)
app.post("/articles/:id", function(req, res) {
  // Create new comment using request body
  db.Comment.create(req.body).then(function(newComment){
    // then, find article using url parameter to update comment array with latest comment
    return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { comments: newComment.id } }, { new: true })
  })
  .then(function(data){
    console.log('User added note: ', data);
    // Return to user added note
    res.json(data);

    // Else, send error to user if caught
  }).catch(function(err){
    res.json(err);
  })
});

// Route for editing a comment
app.put("/comments/:id", function(req, res) {
  console.log('edit comment route', req.body);
  // Find comment using comment id from url parameter and use request.body to update
  db.Comment.findOneAndUpdate({_id: req.params.id}, req.body).then(function(data){
    console.log('User edited note: ', data);

    // Send user edited note to user
    res.json(data);

    // Else, send error to user if caught
  }).catch(function(err){
    res.json(err);
  })
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});