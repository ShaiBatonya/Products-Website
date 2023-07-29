const router = require("express").Router();

// auth middlewares
const auth_manager = require("../middlewares/auth_manager");
const auth_user = require("../middlewares/auth_user");
//__________________

// functions from managers controllers
const {
  loginManager,
  logoutManager,
  authManager,
  addManagerForAdmins,
} = require("../controllers/managers_controller");
//__________________

// function from users controller
const {
  getAllCustomersForManager,
  getCustomerByIdForManager,
  deleteUserByIdForManager,
  updateUserByIdForManager,
  addUserForManager,
  loginCustomer,
  authCustomer,
  logoutCustomer,
  registerCustomer,
  updateCustomer
} = require("../controllers/users_controller");
//___________________

// admins request
router.post("/admins/add-manager", addManagerForAdmins);
//____________________

// managers requests
router.post("/managers/login", loginManager);
router.post("/managers/logout", auth_manager, logoutManager);
router.get("/managers/auth", authManager);
router.post("/add-user-for-managers", addUserForManager);
router.get("/customers-for-managers", getAllCustomersForManager);
router.get("/customer-by-id-for-manager/:user_id", getCustomerByIdForManager);
router.delete("/delete-user-for-managers/:user_id", deleteUserByIdForManager);
router.put("/update-user-for-managers/:user_id", updateUserByIdForManager);
// __________________

// customers requests
router.post("/customers/login", loginCustomer);
router.post("/customers/logout", auth_user, logoutCustomer);
router.get("/customers/auth", authCustomer);
router.post("/customers/register", registerCustomer);
router.put("/customers/update/:id", auth_user,  updateCustomer);

//___________________

module.exports = router;
