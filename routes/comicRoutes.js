const express = require('express');
const router = express.Router();
const Comic = require('../models/Comic');

// Get all comics with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, tags } = req.query;
    const query = {};
    
    if (genre) query.genre = genre;
    if (tags) query.tags = { $in: tags.split(',') };
    
    const comics = await Comic.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ last_updated: -1 });
    
    const total = await Comic.countDocuments(query);
    
    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      results: comics
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comics' });
  }
});

// Search comics by title
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query required' });
    
    const comics = await Comic.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ score: { $meta: 'textScore' } });
    
    const total = await Comic.countDocuments({ $text: { $search: q } });
    
    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      results: comics
    });
  } catch (error) {
    res.status(500).json({ error: 'Error searching comics' });
  }
});

// Get comic by ID
router.get('/:id', async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) return res.status(404).json({ error: 'Comic not found' });
    res.json(comic);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comic' });
  }
});

module.exports = router;
