const express = require('express');
const route = express.Router();
const reviewController = require('../controller/review.c')

route.get('/', reviewController.getReviews)

module.exports = route;