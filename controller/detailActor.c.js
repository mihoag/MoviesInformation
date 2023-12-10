const actor = require('../model/actor')
const listActorMovie = require('../model/listActorMovie')
class detailMovieController {
    async showIndex(req, res, next) {
        try {
            let id = req.query.id;
            //let detailMovie = await 
            //console.log(id)
            //let listActor = await listActorMovie.getL(id);
            let actors = await actor.getById(id);
            let listFilm = await listActorMovie.getListFilmByActorId(id);
            res.render('detailActor', { detailActor: actors, listFilm: listFilm });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new detailMovieController();