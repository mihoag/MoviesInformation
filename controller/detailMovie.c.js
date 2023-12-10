const movie = require('../model/movie')
const listActorMovie = require('../model/listActorMovie')
const reviews = require('../model/reviews')

class detailMovieController {
    async showIndex(req, res, next) {
        try {
            let id = req.body.id;
            if (id === undefined) {
                id = req.query.id;
            }
            let detailMovie = await movie.getById(id);
            //console.log(id)
            let listActor = await listActorMovie.getListActorByMovieId(id);
            //console.log(listActor);
            let listReviews = await reviews.getListReviewById(id);
            res.render('detailMovie', { detailMovie: detailMovie, listActor: listActor, id: id, listReviews: listReviews });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new detailMovieController();