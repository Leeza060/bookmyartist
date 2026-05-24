const CategoryModel = require("../models/categoryModel");

exports.addCategory = async (req, res) => {
  let categoryExists = await CategoryModel.findOne({
    category_name: req.body.category_name,
  });
  if (categoryExists) {
    return res.status(400).json({ error: "Category already exists." });
  }
  let categoryToAdd = await CategoryModel.create({
    category_name: req.body.category_name,
  });
  if (!categoryToAdd) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(categoryToAdd);
};

exports.getAllCategories = async (req, res) => {
  let categories = await CategoryModel.find();
  if (!categories) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.status(200).json({count: categories.length, categories });
};

exports.getCategoryDetails = async (req, res) => {
  let category = await CategoryModel.findById(req.params.categoryId);
  if (!category) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(category);
};

exports.updateCategory = async (req, res) => {
  let categoryToUpdate = await CategoryModel.findByIdAndUpdate(
    req.params.categoryId,
    {
      category_name: req.body.category_name,
    },
    { new: true },
  );
  if (!categoryToUpdate) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(categoryToUpdate);
};

exports.deleteCategory = (req, res) => {
  CategoryModel.findByIdAndDelete(req.params.categoryId)
    .then((deletedCategory) => {
      if (!deletedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.send({ message: "Category deleted successfully" });
    })
    .catch((error) => {
      return res.status(400).json({ error: "Something went wrong" });
    });
};
