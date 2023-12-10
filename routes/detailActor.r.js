const express = require('express');
const route = express.Router();
const detailActorController = require('../controller/detailActor.c')

route.get('/', detailActorController.showIndex)

module.exports = route;