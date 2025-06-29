const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const propertyRoute = require("./property.routes");
const serviceRoute = require("./service.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/properties",
    route: propertyRoute,
  },
  {
    path: "/services",
    route: serviceRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
];

// Mount all routes on /v1 path
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
