const db = require('../Utils/db')
module.exports = class reviews {
    // get list actor by id movie
    static async getListReviewById(id) {
        try {
            let data = await db.getById("reviews", "movieid", id);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

}