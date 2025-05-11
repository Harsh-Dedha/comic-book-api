const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');

// Get all chapters with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, comic_id, sort = 'date_desc' } = req.query;
    const query = {};
    
    if (comic_id) query.comic_id = comic_id;
    
    let sortOption = {};
    if (sort === 'date_desc') sortOption = { date: -1 };
    else if (sort === 'date_asc') sortOption = { date: 1 };
    
    const chapters = await Chapter.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortOption);
    
    const total = await Chapter.countDocuments(query);
    
    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      results: chapters
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chapters' });
  }
});

// Get chapters by comic ID
router.get('/comic/:comicId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const chapters = await Chapter.find({ comic_id: req.params.comicId })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ date: -1 });
    
    const total = await Chapter.countDocuments({ comic_id: req.params.comicId });
    
    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      results: chapters
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chapters for comic' });
  }
});

// Get chapter by ID
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ chapter_id: req.params.id });
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chapter' });
  }
});

module.exports = router;
