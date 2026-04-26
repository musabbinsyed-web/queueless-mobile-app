const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.getCategories);
router.get('/:categoryId/providers', categoryController.getProvidersByCategory);

module.exports = router;
