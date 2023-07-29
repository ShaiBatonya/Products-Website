const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");

module.exports = {
  getDataForDashboard: async (req, res) => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const products_count = await Product.countDocuments();
      const categories_count = await Category.countDocuments();
      const orders_count = await Order.countDocuments();

      const orders = await Order.find().populate('products.product');

      // Create an object to track the total quantity for each product
      const productQuantityObj = {};

      // Iterate over the orders and calculate the total quantity for each product
      orders.forEach((order) => {
        order.products.forEach((productData) => {
          const productId = productData.product._id;
          const quantity = productData.quantity;
          const name = productData.product.product_name;

          if (productQuantityObj.hasOwnProperty(productId)) {
            productQuantityObj[productId].quantity += quantity;
          } else {
            productQuantityObj[productId] = {
                quantity : quantity,
                name : name
            };
          }
        });
      });

      // Sort the product quantity object by descending order of quantity
      const sortedProducts = Object.entries(productQuantityObj).sort(
        (a, b) => b[1].quantity - a[1].quantity
      );

      // Get the top 3 most sold products
      const top3Products = sortedProducts.slice(0, 3);


      const monthly_orders = orders.filter((order) => {
        if (
          order.created_at.getMonth() == currentMonth &&
          order.created_at.getFullYear() == currentYear
        ) {
          return order;
        }
      });

      const total_sales = orders.reduce((total, order) => {
        return total + order.total_price;
      }, 0);

      const monthly_sales = monthly_orders.reduce((total, order) => {
        return total + order.total_price;
      }, 0);

      const obj = {
        products_count,
        categories_count,
        orders_count,
        total_sales,
        monthly_sales,
        top3Products
      };

      return res.status(200).json({
        success: true,
        message: "success to get data for dashboard",
        obj,
      });
    } catch (error) {
      return res.status(500).json({
        message: "error in get data for dashboard",
        error: error.message,
      });
    }
  },
};
