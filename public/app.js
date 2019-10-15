// Function List
function editOrCreateArticleCommentSection(data, editOrCreate) {
  // Select note section for future appending
  let noteSection = $("#comments");
  // Create header
  let header = $('<h4>');
  // Empty the contents of the note section
  noteSection.empty();
  // Make the header the headline from the received data
  header.html(data.headline);

  // If the current process engaged in is a create new comment
  if (editOrCreate === "create") {
    // Append sections to comment section
    noteSection.append(header);
    // Append input areas
    noteSection.append("<input id='titleinput' name='title' >");
    noteSection.append("<textarea id='bodyinput' name='body'></textarea>");
    noteSection.append("<button data-id='" + data._id + "' id='savenote'>New Comment</button>");

    // If the current process engaged in is an edit comment
  } else if (editOrCreate === "edit") {
    // Append sections to comment section
    noteSection.append(header);
    // Append input areas
    noteSection.append("<input id='titleinput' name='title' >");
    noteSection.append("<textarea id='bodyinput' name='body'></textarea>");
    // Use current comment id in button attributeto edit later
    noteSection.append("<button data-id='" + data._id + "' id='editnote'>Edit Comment</button>");
    // Place the title of the comment in the body textarea
    $("#titleinput").val(data.title);
    // Place the body of the comment in the body textarea
    $("#bodyinput").val(data.body);
  }


}

// takes data and id of article to display comments
function displayComments(data, idOfArticle) {
  // Select comment section of current article to append items
  let currentCommentSection = $('#commentSection' + idOfArticle);

  // Iterate through data appending article data as list
  for (let i = 0; i < data.length; i++) {

    console.log(data[i]);
    // Init bootstrap card
    let card = $('<div>');
    let cardBody = $('<div>');
    // Init header, text and button for appending
    let title = $('<h5>');
    let body = $('<h6>');
    let editButton = $('<button>');

    // Add attributes and details from data as required
    card.addClass("card");
    cardBody.addClass("card-body");
    title.addClass("card-title");
    body.addClass("card-subtitle mb-2 text-muted");

    title.html(data[i].title);
    body.html(data[i].body);
    editButton.html('Edit');
    editButton.attr('data-id', data[i]._id);
    editButton.attr('id', 'editCommentButton');
    editButton.addClass("btn btn-primary")

    // Append elements to card
    cardBody.append(title);
    cardBody.append(body);
    cardBody.append(editButton);
    card.append(cardBody);



    // Append created items to current targeted comment section
    currentCommentSection.append(card);
    // A textarea to add a new note body
  }

}

function displayArticles(data) {
  // Iterate through items in data
  for (var i = 0; i < data.length; i++) {
    // Create text and comment button with required details from data
    // Init bootstrap card
    let card = $('<div>');
    let cardBody = $('<div>');
    // Init header, text and button for appending
    let title = $('<h5>');
    let linkEncase = $('<a>');
    let body = $('<h6>');
    let newCommentButton = $('<button>');
    // Add attributes and details from data as required
    card.addClass("card");
    cardBody.addClass("card-body");
    title.addClass("card-title");
    body.addClass("card-subtitle mb-2 text-muted");
    // Build link and encase around title
    linkEncase.attr('href', data[i].link);
    linkEncase.attr('target', '_blank');
    title.html(data[i].headline);
    linkEncase.append(title);
    // Use summary as body text of card
    body.html(data[i].summary);
    // Button creation and setup
    newCommentButton.html('New Article Comment');
    newCommentButton.attr('data-id', data[i]._id);
    newCommentButton.attr('id', 'newCommentButton');
    newCommentButton.addClass("btn btn-secondary");

    // Appending items to cardboy and card
    cardBody.append(linkEncase);
    cardBody.append(body);
    cardBody.append(newCommentButton);
    card.append(cardBody);


    // Create comment button and apply attributes
    let commentButton = $('<button>');
    commentButton.html('Show Comments');
    commentButton.attr('data-id', data[i]._id);
    commentButton.attr('data-state', 'hide');
    commentButton.attr('id', 'commentButton');
    // Create comment div and apply attributes (for later appending comments)
    let commentDiv = $('<div>');
    commentDiv.attr('id', 'commentSection' + data[i]._id);
    commentDiv.addClass('commentSection');

    // Append comment button and div to articles section
    $("#articles").append(card);
    $("#articles").append(commentButton);
    $("#articles").append(commentDiv);
  }

}

// Arguments begin here
// Grab the articles and display
$.getJSON("/articles", function (data) {
  // For each item in data
  displayArticles(data);
});

// Whenever someone clicks to display comments
$(document).on("click", "#commentButton", function () {
  // Init context specific variables
  let currentCommentButton = $(this);
  var thisId = currentCommentButton.attr("data-id");
  var currentButtonState = currentCommentButton.attr("data-state");
  let currentCommentSection = $('#commentSection' + thisId);

  // Depending on data state, either hide or show comments
  // if currently hidden, 
  if (currentButtonState === "hide") {
    // Empty section just in case
    currentCommentSection.empty();

    // Now make an ajax call for the comments of the clicked article using id
    $.ajax({
        method: "GET",
        url: "/comments/" + thisId
      })
      // With that done, add the comment information to the page
      .then(function (data) {
        console.log('comment front', data);
        // Change text and state of comment button to indicate comments are currently displayed
        currentCommentButton.html('Hide Comments');
        currentCommentButton.attr('data-state', 'display');

        // If comments are present
        if (data.length) {

          // Display comments for this article on page
          displayComments(data, thisId);
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

// Whenever someone clicks a new comment button associated with an article tag
$(document).on("click", "#newCommentButton", function () {
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      // run function to create new comment using most current comment data
      editOrCreateArticleCommentSection(data, 'create');

    });
});

// When you click the savenote button (to create a new note)
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to create a new comment for the current article, using what's entered in the note form inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      // Send data object
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // Then
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the comments section
      $("#comments").empty();
    });
});

// When you click the editnote button
$(document).on("click", "#editnote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a PUT request to change the note, using what's entered in the inputs
  $.ajax({
      method: "PUT",
      url: "/comments/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the comments section
      $("#comments").empty();
    });
});

// Whenever someone clicks an edit comment button
$(document).on("click", "#editCommentButton", function () {
  // Save the id from the button
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the comment data
  $.ajax({
      method: "GET",
      url: "/editComment/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {

      // Use function to edit currently stored comment
      editOrCreateArticleCommentSection(data, 'edit');

    });
});