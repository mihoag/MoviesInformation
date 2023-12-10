const express = require('express');
const route = express.Router();
//const homeController = require('../controller/home.c')
const searchActorController = require('../controller/searchActor.c')
const searchMovieController = require('../controller/searchMovie.c')


route.post('/', async (req, res, next) => {
    let type = req.body.type;
    if (type === 'movie') {
        searchMovieController.searchMovie(req, res, next);
    }
    else {
        searchActorController.searchActor(req, res, next);
    }
})

route.get('/', async (req, res, next) => {
    if (req.query.hasOwnProperty('_movie')) {
        searchMovieController.searchMovie(req, res, next);
    }
    else if (req.query.hasOwnProperty('_actor')) {
        searchActorController.searchActor(req, res, next);
    }
})
module.exports = route;