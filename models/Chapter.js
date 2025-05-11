const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  comic_id: {
    type: String,
    required: true,
    index: true
  },
  name: String,
  link: String,
  date: Date,
  page_links: [String],
  totalPages: Number,
  page_scrape_status: String,
  chapter_id: {
    type: String,
    required: true,
    unique: true
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});

// Create index for date-based queries
ChapterSchema.index({ date: -1 });

module.exports = mongoose.model('Chapter', ChapterSchema);
