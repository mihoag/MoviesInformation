const express = require('express');
const route = express.Router();
const detaiMovieController = require('../controller/detailMovie.c')

route.post('/', detaiMovieController.showIndex)
route.get('/', detaiMovieController.showIndex)

module.exports = route;