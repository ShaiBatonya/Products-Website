let controler_name = "product";
let object_name = "Product";
let objects_name = "products";

let Model = require(`../models/${object_name}`);
const Order = require("../models/Order");

module.exports = {
  // customer functions

  getAllProductsForCustomers: async (req, res) => {
    try {
      /*       const { page = 1, limit = 3} = req.query;

      const count = await Model.count();

      console.log(count);

      const pages = Math.ceil(count / limit);

      console.log(pages);

      const models = await Model.find().skip((page - 1 ) * limit).limit(limit).exec(); */

      const models = await Model.find().exec();

      return res.status(200).json({
        success: true,
        message: `success to find all ${objects_name}`,
        /*         limit,
        count,
        pages, */
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all ${objects_name}`,
        error: error.message,
      });
    }
  },

  getProductByIdForCustomers: async (req, res) => {
    try {
      const models = await Model.findById(req.params.product_id)
        .populate("categories.category")
        .exec();

      return res.status(200).json({
        success: true,
        message: `success to find ${controler_name} by id for - customer`,
        product: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find ${controler_name} by id for - customer}`,
        error: error.message,
      });
    }
  },

  // __________________

  // manager functions

  addProductForManager: async (req, res) => {
    console.log(req.body);
    try {
      // getting values from the body request
      const {
        product_name,
        product_description,
        product_price,
        product_image,
        categories
      } = req.body;

     const fix = JSON.parse(categories).map((c)=>{
      return {
        category:c.id
      }
     });
     
     console.log(fix);

      // creating new model using the values from req.body
      const new_model = new Model({
        product_name,
        product_description,
        product_price,
        product_image,
        categories:fix
      });

      // actual saving
      await new_model.save();

      // return success message
      return res.status(200).json({
        success: true,
        message: `success to add new ${controler_name} - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add ${controler_name} - for managers`,
        error: error.message,
      });
    }
  },
  getAllProductsForManager: async (req, res) => {
    try {
      /*       const { page = 1, limit = 3} = req.query;

      const count = await Model.count();

      console.log(count);

      const pages = Math.ceil(count / limit);

      console.log(pages);

      const models = await Model.find().skip((page - 1 ) * limit).limit(limit).exec(); */

      const models = await Model.find().populate("categories.category").exec();

      return res.status(200).json({
        success: true,
        message: `success to find all ${objects_name} - for managers`,
        /*         limit,
        count,
        pages, */
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all ${objects_name} - for managers`,
        error: error.message,
      });
    }
  },
  getByIdForManager: async (req, res) => {
    try {
      const product = await Model.findById(req.params.product_id)
        .populate("categories.category")
        .exec();

      return res.status(200).json({
        success: true,
        message: `success to find ${controler_name} by id for - manager`,
        product: product,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find ${controler_name} by id for - manager}`,
        error: error.message,
      });
    }
  },
  deleteProductForManager: async (req, res) => {
    try {
      const id = req.params.product_id;

      const exists = await Order.findOne({ "products.product": id });

      console.log(exists);

      if (exists) {
        throw new Error(
          "cannot delete product because have orders related to this product"
        );
      }

      await Model.findByIdAndDelete(id).exec();

      return res.status(200).json({
        success: true,
        message: `success to delete ${controler_name} by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete ${controler_name} by id - for managers`,
        error: error.message,
      });
    }
  },
  updateProductForManager: async (req, res) => {
    try {
      const id = req.params.product_id;

      console.log(req.body);

      const obj = {
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
        product_image: req.body.product_image,
        categories: req.body.categories.map((cat)=> {
          return {
            category: cat._id
          }
        })
      }

      await Model.findByIdAndUpdate(id, obj, {
        /*         runValidators: true,
                context: "query", */
      }) /* .exec() */;

      return res.status(200).json({
        success: true,
        message: `success to update ${controler_name} by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update ${controler_name} by id - for managers`,
        error: error.message,
      });
    }
  },
  uploadNewProductImageForManager: async (req, res) => {
    try {
      console.log(req.file);

      const product_image = `http://localhost:4000/uploads/${req.file.filename}`;

      return res.status(200).json({
        success: true,
        message: `success to upload new product image - for managers`,
        product_image,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in upload new product image - for managers`,
        error: error.message,
      });
    }
  },
  // ____________________

  getById: async (req, res) => {
    try {
      const models = await Model.findById(req.params.id).exec();

      return res.status(200).json({
        success: true,
        message: `success to find ${controler_name} by id`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find ${controler_name} by id}`,
        error: error.message,
      });
    }
  },

  updateById: async (req, res) => {
    try {
      const id = req.params.id;

      await Model.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        context: "query",
      }).exec();

      return res.status(200).json({
        success: true,
        message: `success to update ${controler_name} by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update ${controler_name} by id`,
        error: error.message,
      });
    }
  },

  deleteById: async (req, res) => {
    try {
      const id = req.params.id;

      await Model.findByIdAndDelete(id).exec();

      return res.status(200).json({
        success: true,
        message: `success to delete ${controler_name} by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete ${controler_name} by id`,
        error: error.message,
      });
    }
  },
};
