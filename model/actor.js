const db = require('../Utils/db')
module.exports = class actor {
    constructor(id, name, role, image, summary, birthday, deathDate, castMovies) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.image = image;
        this.summary = summary;
        this.birthday = birthday;
        this.deathDate = deathDate;
        this.castMovies = castMovies;
    }

    //static async getAllA
    // get actor by ID
    static async getById(id) {
        try {
            let data = await db.getById("names", "id", id);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
    static async searchActorByName(keyword) {
        try {
            let data = await db.searchByKeyword("names", "name", keyword);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}