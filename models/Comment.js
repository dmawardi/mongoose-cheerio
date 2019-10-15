var mongoose = require("mongoose");

// Save a reference to Mongoose Schema constructor
var Schema = mongoose.Schema;

// Build Comment Schema
var CommentSchema = new Schema({
  // `title` field of type String
  title: String,
  // `body` field of type String
  body: String
},
// include timestamp fields automatically
{
  timestamps: true
});

// Create model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
