const controler_name = "order";
const object_name = "Order";
const objects_name = "orders";
const mailer = require("nodemailer");

const Model = require(`../models/${object_name}`);

module.exports = {
  // managers functions

  getAllOrdersForManagers: async (req, res) => {
    try {
      const models = await Model.find()
        .populate(["user", "products.product"])
        .exec();

      return res.status(200).json({
        success: true,
        message: `success to find all ${objects_name} - for managers`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all ${objects_name} - for -managers`,
        error: error.message,
      });
    }
  },

  updateStatusForManagers: async (req, res) => {
    try {
      const id = req.params.id;

      const order = await Model.findByIdAndUpdate(id, { status: req.body.status },{new:true}).exec();

      
      if(req.body.status == 3) {
        try {
          const mail_template = `
          <html dir="ltr">
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                }
          
                h1 {
                  color: #333;
                }
          
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f8f8f8;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  direction: ltr
                }
          
                .order-details {
                  margin-bottom: 20px;
                }
          
                .order-details table {
                  width: 100%;
                  border-collapse: collapse;
                }
          
                .order-details th,
                .order-details td {
                  padding: 10px;
                  border: 1px solid #ccc;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Dear ${order.customer_details.customer_name},</h1>
                <p>You order is ready and will ship soon to you.</p>
          
                <div class="order-details">
                  <h2>Order Details:</h2>
                  <table>
                    <tr>
                      <th>Order Number:</th>
                      <td>${order.order_number}</td>
                    </tr>
                    <tr>
                      <th>Total Amount:</th>
                      <td>${order.total_price} $</td>
                    </tr>
                  </table>
                </div>
          
                <p>Thank you for choosing our service.</p>
          
                <p>Best regards,<br>Nofar</p>
              </div>
            </body>
          </html>
          `;
  
          const transporter = mailer.createTransport({
            service: "gmail",
            auth: {
              user: "davidbiton2@gmail.com",
              pass: process.env.GP,
            },
          });
  
          const mail = {
            to: order.customer_details.customer_email,
            subject: `Order Ready : ${order.order_number}`,
            html: mail_template,
          };
  
          await transporter.sendMail(mail);
  
          return res.status(200).json({
            success: true,
            message: `success to update ${controler_name} status by id - for managers`,
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: `success to update ${controler_name} status by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update ${controler_name} status by id - for managers`,
        error: error.message,
      });
    }
  },

  getOrderByIdForManagers: async (req, res) => {
    try {
      const models = await Model.findById(req.params.id)
        .populate([/* 'user', */ "products.product"])
        .exec();

      return res.status(200).json({
        success: true,
        message: `success to find ${controler_name} by id - for managers`,
        [controler_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find ${controler_name} by id} - for managers`,
        error: error.message,
      });
    }
  },
  deleteOrderByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;

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

  //___________________

  // guests requests

  //___________________

  // guests and registered users functions

  addNewOrderForGuest: async (req, res) => {
    try {
      // gettind values from the body request
      const { payment_details, products, customer_details } = req.body;

      // creating new model using the values from req.body
      const new_model = new Model({
        payment_details,
        products,
        customer_details,
      });

      // actual saving
      await new_model.save();

      // return success message
      return res.status(200).json({
        success: true,
        message: `success to add new ${controler_name} - for guest`,
        order_number: new_model.order_number,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add ${controler_name} - for guest`,
        error: error.message,
      });
    }
  },

  //___________________

  // registered users functions
  getOrdersForUser: async (req, res) => {
    try {
      const models = await Model.find({ user: req.params.user_id })
        .populate(["user", "products.product"])
        .exec();

      return res.status(200).json({
        success: true,
        message: `success to find ${objects_name} by user id`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find ${objects_name} by user id}`,
        error: error.message,
      });
    }
  },
  addNewOrderForRegisteredCustomer: async (req, res, next) => {
    try {
      // getting values from the body request
      const { user, payment_details, products, customer_details } = req.body;

      // creating new model using the values from req.body
      const new_model = new Model({
        user,
        payment_details,
        products,
        customer_details,
      });
      // actual saving
      await new_model.save();

      try {
        const mail_template = `
        <html dir="ltr">
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
        
              h1 {
                color: #333;
              }
        
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f8f8;
                border: 1px solid #ccc;
                border-radius: 5px;
                direction: ltr
              }
        
              .order-details {
                margin-bottom: 20px;
              }
        
              .order-details table {
                width: 100%;
                border-collapse: collapse;
              }
        
              .order-details th,
              .order-details td {
                padding: 10px;
                border: 1px solid #ccc;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Dear ${customer_details.customer_name},</h1>
              <p>Thank you for your order! We have received your payment and are processing your order.</p>
        
              <div class="order-details">
                <h2>Order Details:</h2>
                <table>
                  <tr>
                    <th>Order Number:</th>
                    <td>${new_model.order_number}</td>
                  </tr>
                  <tr>
                    <th>Total Amount:</th>
                    <td>${new_model.total_price} $</td>
                  </tr>
                </table>
              </div>
        
              <p>We will send you another email once your order has been shipped.</p>
        
              <p>Thank you for choosing our service.</p>
        
              <p>Best regards,<br>Nofar</p>
            </div>
          </body>
        </html>
        `;

        const transporter = mailer.createTransport({
          service: "gmail",
          auth: {
            user: "davidbiton2@gmail.com",
            pass: process.env.GP,
          },
        });

        const mail = {
          to: customer_details.customer_email,
          subject: `New Order : ${new_model.order_number}`,
          html: mail_template,
        };

        await transporter.sendMail(mail);

        return res.status(200).json({
          success: true,
          message: `success to add new order - for registered user`,
          order_number: new_model.order_number,
        });
      } catch (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      return res.status(500).json({
        message: `error in add ${controler_name} - for guest`,
        error: error.message,
      });
    }
  },
  // __________________

  add: async (req, res) => {
    try {
      // gettind values from the body request
      const { user, total_price, payment_details, products } = req.body;

      // creating new model using the values from req.body
      const new_model = new Model({
        user,
        total_price,
        payment_details,
        products,
      });

      // actual saving
      await new_model.save();

      // return success message
      return res.status(200).json({
        success: true,
        message: `success to add new ${controler_name}`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add ${controler_name}`,
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const models = await Model.find()
        .populate(["user", "products.product"])
        .exec();

      return res.status(200).json({
        success: true,
        message: `success to find all ${objects_name}`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all ${objects_name}`,
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const models = await Model.findById(req.params.id)
        .populate(["user", "products.product"])
        .exec();

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

      await Model.findByIdAndUpdate(id, req.body).exec();

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
