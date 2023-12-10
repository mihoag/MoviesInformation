const express = require('express');
const route = express.Router();
const favController = require('../controller/fav.c')

route.get('/delete/:id', favController.deleteFavMovie)
route.get('/insert/:id', favController.insertFavMovie)
route.get('/', favController.showIndex)

module.exports = route;