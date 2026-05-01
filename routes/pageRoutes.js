const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.renderIndex);
router.get('/login', pageController.renderLogin);

module.exports = router;
