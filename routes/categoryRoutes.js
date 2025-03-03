const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController'); 

router.post('/', categoryController.addCategory);
router.get('/', categoryController.getCategories);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
