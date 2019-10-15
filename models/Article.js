var mongoose = require("mongoose");

// Save Schema constructor reference
var Schema = mongoose.Schema;

// Build Article schema
var ArticleSchema = new Schema({
  // `headline`
  headline: {
    type: String,
    required: true,
    trim: true
  },

  // summary
  summary: {
    type: String,
    required: false,
    trim: true
  },

  // `link` is required and of type String
  link: {
    type: String,
    required: true,
    unique: true
  },

  // Build relation with Comment model. Multiple comments for one article
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
},
// Create timestamp fields automatically
{
  timestamps: true
});


// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
