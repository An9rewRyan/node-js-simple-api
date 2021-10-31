const express = require("express");
const home_controller = require("../controllers/home_controller.js");
const home_router = express.Router();

home_router.get('/', home_controller.home);
home_router.get('/about', home_controller.about);
home_router.get('/contact', home_controller.contact);

module.exports = home_router;
