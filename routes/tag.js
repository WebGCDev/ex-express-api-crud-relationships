const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag');

router.post('/tags', tagController.createTag);
router.get('/tags', tagController.getTags);

module.exports = router;
