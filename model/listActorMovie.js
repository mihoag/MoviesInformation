const db = require('../Utils/db')
module.exports = class listActorMovie {
    // get list actor by id movie
    static async getListActorByMovieId(id) {
        try {
            let data = await db.getListActorByMovieId(id);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
    static async getListFilmByActorId(id) {
        try {
            let data = await db.getListFilmByActorId(id);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}