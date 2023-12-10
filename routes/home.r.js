const express = require('express');
const route = express.Router();
const homeController = require('../controller/home.c')


route.get('/', homeController.showIndex)
module.exports = route;