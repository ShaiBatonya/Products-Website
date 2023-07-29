const Category = require("../models/Category");
const Product = require("../models/Product");

module.exports = {
  // managers functions

  getAllCategoriesForManagers: async (req, res) => {
    try {
      const categories = await Category.find().exec();

      return res.status(200).json({
        success: true,
        message: `success to find all categories - for managers`,
        categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all categories - for -managers`,
        error: error.message,
      });
    }
  },

  getCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;

      const category = await Category.findById(id).exec();

      return res.status(200).json({
        success: true,
        message: `success to find category by id - for managers`,
        category,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get category by id - for -managers`,
        error: error.message,
      });
    }
  },

  addNewCategoryForManagers: async (req, res) => {
    try {
      const { category_name } = req.body;

      const category = new Category({
        category_name,
      });

      await category.save();

      return res.status(200).json({
        success: true,
        message: `success to add new category - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add new category - for managers`,
        error: error.message,
      });
    }
  },

  updateCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;
      const {category_name} = req.body;

      await Category.findByIdAndUpdate(id, {
        category_name,
      });

      return res.status(200).json({
        success: true,
        message: `success to update category by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update category by id - for managers`,
        error: error.message,
      });
    }
  },
  deleteCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;

      const exists = await Product.findOne({'categories.category':id});

      if(exists) {
        throw new Error("cannot delete category because have products related to this category");
      }

      await Category.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: `success to delete category by id - for managers`,
      });
    } catch (error) {
      
      return res.status(500).json({
        message: `error in delete category by id - for managers`,
        error: error.message,
      });
    }
  },

  //___________________


  // customers functions
  getAllCategoriesForCustomers: async (req, res) => {
    try {
      const categories = await Category.find().exec();

      return res.status(200).json({
        success: true,
        message: `success to find all categories - for customer`,
        categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all categories - for -customer`,
        error: error.message,
      });
    }
  }
  //___________________

};
