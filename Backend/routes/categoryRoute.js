const { addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController')

const router = require('express').Router()

router.post('/addcategory', addCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategorydetails/:id', getCategoryDetails)

router.put("/updatecategory/:id", updateCategory);
router.delete("/deletecategory/:id", deleteCategory);


module.exports = router
