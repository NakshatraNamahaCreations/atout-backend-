const express = require('express');
const router = express.Router();
const CategoryController = require('../Controllers/categoryController'); 

router.post('/', CategoryController.addCategory);
router.get('/', CategoryController.getCategories);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;
