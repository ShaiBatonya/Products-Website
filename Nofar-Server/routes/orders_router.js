const router = require("express").Router();
const auth_manager = require("../middlewares/auth_manager");
const mailer = require("../middlewares/mailer")

// managers functions

const {
  getAllOrdersForManagers,
  updateStatusForManagers,
  getOrderByIdForManagers,
  deleteOrderByIdForManagers,
} = require("../controllers/orders_controller");

// __________________

// guests functions

const { addNewOrderForGuest } = require("../controllers/orders_controller");

//_________________

// registered users functions

const {
  getOrdersForUser,
  addNewOrderForRegisteredCustomer,
} = require("../controllers/orders_controller");

//_________________

// managers requests

router.get("/managers/all"/* ,auth_manager */, getAllOrdersForManagers),
  router.put("/managers/update-status/:id", updateStatusForManagers),
  router.get("/managers/order-details/:id", getOrderByIdForManagers),
  router.delete("/managers/delete-order/:id", deleteOrderByIdForManagers),
  //__________________

  // guests requests

  router.post("/add", addNewOrderForGuest);

//_________________

// registered users requests

router.get("/by-id-for-customer-user/:user_id", getOrdersForUser);
router.post(
  "/add-for-registered-users",
  addNewOrderForRegisteredCustomer
);

//_________________

module.exports = router;
