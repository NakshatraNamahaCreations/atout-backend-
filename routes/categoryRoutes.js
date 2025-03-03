const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController'); 

router.post('/', CategoryController.addCategory);
router.get('/', CategoryController.getCategories);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;
