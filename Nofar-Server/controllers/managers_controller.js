let controler_name = "manager";
let object_name = "Manager";
let objects_name = "managers";

let Model = require(`../models/${object_name}`);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  // functions for admins
  addManagerForAdmins: async (req, res) => {
    try {
      // gettind values from the body request
      const {
        manager_name,
        manager_email,
        manager_password,
        manager_phone,
        manager_address,
      } = req.body;

      // creating new model using the values from req.body
      const new_model = new Model({
        manager_name,
        manager_email,
        manager_password,
        manager_phone: manager_phone || "",
        manager_address: manager_address || "",
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
        .populate(["manager_cart", "manager_orders.order"])
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
        .populate(["manager_cart", "manager_orders.order"])
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
  loginManager: async (req, res) => {
    try {
      const { manager_email, manager_password } = req.body;

      const manager = await Model.findOne({ manager_email });

      if (!manager) {
        throw new Error("bad creditians");
      }

      const equal = await bcrypt.compare(
        manager_password,
        manager.manager_password
      );

      if (!equal) {
        throw new Error("bad creditians");
      }

      // manager login success

      let payload = {
        manager: manager._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 10800,
      });

      let oldTokens = manager.tokens || [];

      if (oldTokens.length) {
        oldTokens = oldTokens.filter((t) => {
          const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
          if (timeDiff < 10800) {
            return t;
          }
        });
      }

      await Model.findByIdAndUpdate(manager._id, {
        tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
      }).exec();

      return res.status(201).json({
        success: true,
        message: "manager login successfully",
        token,
        manager: {
          _id: manager._id,
          manager_name: manager.manager_name,
          manager_email: manager.manager_email,
        },
      });
    } catch (error) {
      return res.status(401).json({
        message: "error in login request",
        error: error.message,
      });
    }
  },

  logoutManager: async (req, res) => {
    if (req.headers && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
          return res
            .status(401)
            .json({ success: false, message: "Authorization fail!" });
        }

        const tokens = req.manager.tokens;

        const newTokens = tokens.filter((t) => t.token !== token);

        await Model.findByIdAndUpdate(req.manager._id, {
          tokens: newTokens,
        }).exec();

        /* res.clearCookie("token"); */

        return res.status(200).json({
          success: true,
          message: "success to logout manager",
        });
      } catch (error) {
        return res.status(500).json({
          message: "error in logout request",
          error: error.message,
        });
      }
    }
  },

  authManager: async (req, res) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error("no token provided");
      }

      const bearer = token.split(" ")[1];

      const decode = jwt.verify(bearer, process.env.JWT_SECRET);

      const manager = await Model.findById(decode.manager).exec();

      if (!manager || manager.permission !== 1) {
        throw new Error("access denided");
      }

      let checkTokenInArr = manager.tokens.some((obj) => obj.token == bearer);

      if (!checkTokenInArr) {
        throw new Error("manager unautherized");
      }

      let payload = {
        manager: manager._id,
      };

      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 10800,
      });

      let oldTokens = manager.tokens || [];

      if (oldTokens.length) {
        oldTokens = oldTokens.filter((t) => {
          const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
          if (timeDiff < 10800) {
            return t;
          }
        });
      }

      await Model.findByIdAndUpdate(manager._id, {
        tokens: [
          ...oldTokens,
          { token: refreshToken, signedAt: Date.now().toString() },
        ],
      }).exec();

      return res.status(201).json({
        success: true,
        message: "manager authoraized",
        token: refreshToken,
        manager: {
          _id: manager._id,
          manager_name: manager.manager_name,
          manager_email: manager.manager_email,
        },
      });
    } catch (error) {
      return res.status(401).json({
        message: "unauthoraized",
        error: error.message,
      });
    }
  },
};
