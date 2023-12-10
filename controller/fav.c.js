const movie = require('../model/movie')
class FavController {
    async showIndex(req, res, next) {
        try {
            let favMovie = await movie.selectAllFavMovies();
            //console.log(top5movies)    
            // console.log(arr);
            // console.log(favMovie)
            res.render('fav', { favMovies: favMovie });
        } catch (error) {
            next(error);
        }
    }

    async deleteFavMovie(req, res, next) {
        try {
            let id = req.params.id;
            console.log(id)
            await movie.deleteFavMovie(id);
            res.redirect('/fav');
        } catch (error) {
            next(error);
        }
    }

    async insertFavMovie(req, res, next) {
        try {
            let id = req.params.id;
            //console.log(id)
            await movie.insertFavMovie(id);
            res.redirect('/fav');
        } catch (error) {
            next(error);
        }
    }

}
module.exports = new FavController();