const { 
  addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory 
} = require('../controllers/categoryController')

const router = require('express').Router()

router.post('/', addCategory)
router.get('/', getAllCategories)
router.get('/:id', getCategoryDetails)

router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);


module.exports = router
