axios.get("http://www.echojs.com/").then(function(response) {
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