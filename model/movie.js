const db = require('../Utils/db')
module.exports = class movie {
    constructor(id, title, fullTitle, year, image, releaseDate, plot, genreList, imDbrating, boxOffice, isFav) {
        this.id = id;
        this.title = title;
        this.fullTitle = fullTitle;
        this.year = year;
        this.image = image;
        this.releaseDate = releaseDate;
        this.plot = plot;
        this.genreList = genreList;
        this.imDbrating = imDbrating;
        this.boxOffice = boxOffice;
        this.isFav = isFav;
    }

    static async selectAllMovies() {

    }
    static async insertMovie(content) {

    }
    static async deleteFavMovie(id) {
        await db.deleteFavMovie("movies", id)
    }
    static async insertFavMovie(id) {
        await db.insertFavMovie("movies", id)
    }

    static async selectTop5Rating() {
        try {
            let data = await db.selectTop("movies", "imDbrating", 5);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    static async searchMovieByKeyword(keyword) {
        try {
            let data = await db.searchByKeyword("movies", "fulltitle", keyword);
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    static async searchMovieByGenre(keyword) {
        try {
            let data = await db.getAll("movies");
            let result = [];
            for (let i = 0; i < data.length; i++) {
                let check = false;
                for (let j = 0; j < data[i].genrelist.length; j++) {
                    if (data[i].genrelist[j].toLowerCase().includes(keyword.toLowerCase())) {
                        check = true;
                    }
                }
                if (check) {
                    result.push(data[i]);
                }
            }
            return result;
            //return data;
        } catch (error) {
            console.log(error)
        }
    }

    static async selectTop30BoxOffice() {
        try {
            let data = await db.selectTop("movies", "boxOffice", 30);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
    static async selectTopFav() {
        try {
            let data = await db.selectTopFav("movies", "imdbrating", 15);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    static async selectAllFavMovies() {
        try {
            let data = await db.selectAllFavMovies("movies");
            return data;
        } catch (error) {
            console.log(error);
        }
    }



    static async getById(id) {
        try {
            let data = await db.getById("movies", "id", id);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

}