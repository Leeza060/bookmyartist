const { 
  addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory 
} = require('../controllers/categoryController')
const { isLoggedIn } = require('../middleware/authentication')

const router = require('express').Router()

router.post('/', isLoggedIn, addCategory)
router.get('/', getAllCategories)
router.get('/:categoryId', getCategoryDetails)

router.put("/:categoryId", updateCategory);
router.delete("/:categoryId", deleteCategory);


module.exports = router
