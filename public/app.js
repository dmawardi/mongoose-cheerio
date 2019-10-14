// Function List
function editOrCreateArticleCommentSection(data) {
  let noteSection = $("#notes");
  let header = $('<h2>');
  // Empty the notes from the note section
  noteSection.empty();
  // fill in header text
  header.html(data.title);


  // Append sections
  noteSection.append(header);
  noteSection.append("<input id='titleinput' name='title' >");
  noteSection.append("<textarea id='bodyinput' name='body'></textarea>");
  noteSection.append("<button data-id='" + data._id + "' id='savenote'>New Comment</button>");
  
  }

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");

    // Create comment button
    let commentButton = $('<button>');
    commentButton.html('Show Comments');
    commentButton.attr('data-id', data[i]._id);
    commentButton.attr('data-state', 'hide');
    commentButton.attr('id', 'commentButton');
    // Create comment div (for later appending comments)
    let commentDiv = $('<div>');
    commentDiv.attr('id', 'commentSection'+data[i]._id);

    // Append to articles
    $("#articles").append(commentButton);
    $("#articles").append(commentDiv);
  }
});

// Whenever someone clicks to display a comment
$(document).on("click", "#commentButton", function() {
  // Empty the notes from the note section
  // Save the id from the p tag
  let currentCommentButton = $(this);
  var thisId = currentCommentButton.attr("data-id");
  var currentButtonState = currentCommentButton.attr("data-state");
  let currentCommentSection = $('#commentSection'+thisId);

  if (currentButtonState === "hide") {
    // Empty section just in case
    currentCommentSection.empty();
  
    // Now make an ajax call for the comments of the article using id
    $.ajax({
      method: "GET",
      url: "/comments/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log('comment front', data);
        // Change text and state of comment button
        currentCommentButton.html('Hide Comments');
        currentCommentButton.attr('data-state', 'display');
        
        
        console.log('comment front data length', data.length);
        
        if (data.length) {
          
          for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            let header = $('<h2>');
            let body = $('<p>');
            let editButton = $('<button>');
            
            header.html(data[i].title);
            body.html(data[i].body);
            editButton.html('Edit');
            editButton.attr('data-id', data[i]._id);
            editButton.attr('id', 'editCommentButton');
      
            currentCommentSection.append(header);
            // An input to enter a new title
            currentCommentSection.append(body);
            // A textarea to add a new note body
            currentCommentSection.append(editButton);
          }
        // A button to submit a new note, with the id of the article saved to it
        // currentCommentSection.append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
          // Place the title of the note in the title input
          // $("#titleinput").val(data.comments.title);
          // Place the body of the note in the body textarea
          // $("#bodyinput").val(data.comments.body);
        }
      });
  } else {
    // change button state
    $(this).html('Show Comments');
    $(this).attr('data-state', 'hide');

    // Empty article's comment section
    currentCommentSection.empty();
  }

});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  // With that done, add the note information to the page
  .then(function(data) {
    console.log("edit or create: ",data);
    
    
      editOrCreateArticleCommentSection(data);


      console.log('front', data);
      // The title of the article
      // $("#notes").append("<h2>" + data.title + "</h2>");
      // // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      // // A textarea to add a new note body
      // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it

      // If there's a note in the article
      if (data.comments) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comments.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.comments.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
