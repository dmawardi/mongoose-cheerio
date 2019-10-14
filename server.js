var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

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

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/articlesdb", { useNewUrlParser: true, useFindAndModify: false });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.engadget.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // console.log($("div .thing"));
    

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};
      console.log(i);

      // grab the required details from the page and store in results
      result.headline = $("div.th-title", this)
        .text().replace(/\n/g, '').trim();

        result.summary = $("p", this)
        .text();

      result.link = $(this)
        .children("a")
        .attr("href");

        if (result.link && result.link !== "#") {
          // Check if record already exists
          db.Article.exists({ link: result.link }).then(function(exists){
            if (!exists) {
              // Create a new Article using the `result` object built from scraping
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

        console.log(result);
        
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});




// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find().then(function(data){
    res.json(data);
  }).catch(function(err){
    res.json(err);
  })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  console.log("requesting articles",req.params.id);
  db.Article.findOne({_id: req.params.id}).populate('comments').then(function(data){
    console.log('server', data);
    res.json(data);
  }).catch(function(err){
    res.json(err);
  })
});

// Route for grabbing article comments
app.get("/comments/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  console.log("requesting comments",req.params.id);
  db.Article.findOne({_id: req.params.id}).populate('comments').exec().then(function(data){
    console.log('server', data);
    res.json(data.comments);
  }).catch(function(err){
    res.json(err);
  })
});

// Route for grabbing article comments
app.get("/editComment/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  console.log("requesting comments",req.params.id);
  db.Comment.findOne({_id: req.params.id}).then(function(data){
    console.log('server', data);
    res.json(data);
  }).catch(function(err){
    res.json(err);
  })
});

// Route for creating a new comment
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Comment.create(req.body).then(function(newComment){
    return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { comments: newComment.id } }, { new: true })
  })
  .then(function(data){
    console.log('User added note: ', data);
    res.json(data);
  }).catch(function(err){
    res.json(err);
  })
});

// TODO
// Route for editing a comment
app.put("/comments/:id", function(req, res) {
  console.log('edit comment route', req.body);
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Comment.findOneAndUpdate({_id: req.params.id}, req.body).then(function(data){
    console.log('User edited note: ', data);
    res.json(data);
  }).catch(function(err){
    res.json(err);
  })
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

// old code
// axios.get("http://www.echojs.com/").then(function(response) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);

//     // Now, we grab every h2 within an article tag, and do the following:
//     $("article h2").each(function(i, element) {
//       // Save an empty result object
//       var result = {};

//       // Add the text and href of every link, and save them as properties of the result object
//       result.headline = $(this)
//         .children("a")
//         .text();
//       result.link = $(this)
//         .children("a")
//         .attr("href");

//         // Check if record already exists
//         db.Article.exists({ headline: result.headline }, function(exists){
//           console.log("article exists: ",exists);
//         })

//         let articleExists = false;

//         if (articleExists) {
//           console.log('article exists, skipping');
//         } else {
//           // Create a new Article using the `result` object built from scraping
//           db.Article.create(result)
//             .then(function(dbArticle) {
//               // View the added result in the console
//               console.log("Created:",dbArticle);
//             })
//             .catch(function(err) {
//               // If an error occurred, log it
//               console.log(err);
//             });

//         }
//     });

//     // Send a message to the client
//     res.send("Scrape Complete");
//   });

// axios.get("http://old.reddit.com/").then(function(response) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);
//     // console.log($("div .thing"));
    

//     // Now, we grab every h2 within an article tag, and do the following:
//     $("div .thing").each(function(i, element) {
//       // Save an empty result object
//       var result = {};
//       // console.log(element);

//       // grab the text of the a with a class of title in the context of this element
//       result.headline = $('a.title', this).text();
//       result.thumbnail = $('a.thumbnail', this).attr("href");

//       result.link = $(this)
//         .children("a")
//         .attr("href");

//         // Check if record already exists
//         db.Article.exists({ headline: result.headline }, function(exists){
//           console.log("article exists: ", exists);
//         })

//         console.log(result);
//         let articleExists = false;

//         // if (articleExists) {
//         //   console.log('article exists, skipping');
//         // } else {
//         //   // Create a new Article using the `result` object built from scraping
//         //   db.Article.create(result)
//         //     .then(function(dbArticle) {
//         //       // View the added result in the console
//         //       console.log("Created:",dbArticle);
//         //     })
//         //     .catch(function(err) {
//         //       // If an error occurred, log it
//         //       console.log(err);
//         //     });

//         // }
//     });

//     // Send a message to the client
//     res.send("Scrape Complete");
//   });
