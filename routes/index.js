const homeRoute = require('./home.r')
const favRoute = require('./fav.r')
const detailRoute = require('./detailMovie.r')
const detailActor = require('./detailActor.r')
const searchRoute = require('./search.r')
const review = require('./review.r')
function route(app) {
    app.use('/detailActor', detailActor);
    app.use('/detailMovie', detailRoute);
    app.use('/fav', favRoute);
    app.use('/search', searchRoute);
    app.use('/review', review)
    app.use('/', homeRoute);

}
module.exports = route;