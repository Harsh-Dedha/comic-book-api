const mongoose = require('mongoose');

const ComicSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    index: 'text'
  },
  year: {
    type: Number,
    index: true
  },
  link: String,
  processing_status: String,
  genre: String,
  tags: [String],
  number_of_chapters: Number,
  poster: String,
  last_updated: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Comic', ComicSchema);
