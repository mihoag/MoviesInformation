const movie = require('../model/movie')

class homeController {
    async showIndex(req, res, next) {
        try {
            let top5movies = await movie.selectTop5Rating();
            //console.log(top5movies);
            let arr = [];
            for (let i = 0; i < top5movies.length; i++) {
                if (i == 0) {
                    arr.push(Object.assign(top5movies[i], { active: 'active' }))
                }
                else {
                    arr.push(Object.assign(top5movies[i], { active: 'nonactive' }))
                }
            }
            //console.log(arr);

            let topBoxOffice = await movie.selectTop30BoxOffice();
            // console.log(topBoxOffice);
            let arr1 = [];
            for (let i = 0; i < topBoxOffice.length; i = i + 3) {
                // arr1.push({id1 : })
                let id1 = topBoxOffice[i].id;
                let id2 = topBoxOffice[i + 1].id;
                let id3 = topBoxOffice[i + 2].id;
                let img1 = topBoxOffice[i].image;
                let img2 = topBoxOffice[i + 1].image;
                let img3 = topBoxOffice[i + 2].image;
                if (i == 0) {
                    arr1.push({ id1: id1, id2: id2, id3: id3, img1: img1, img2: img2, img3: img3, active: 'active' })
                }
                else {
                    arr1.push({ id1: id1, id2: id2, id3: id3, img1: img1, img2: img2, img3: img3, active: 'nonactive' })
                }
            }


            let arr2 = [];
            let topfav = await movie.selectTopFav();
            for (let i = 0; i < topfav.length; i = i + 3) {
                // arr1.push({id1 : })
                let id1 = '';
                let id2 = '';
                let id3 = '';
                let img1 = '';
                let img2 = '';
                let img3 = '';

                if (i < topfav.length) {
                    id1 = topfav[i].id;
                    img1 = topfav[i].image;
                }
                if (i + 1 < topfav.length) {
                    id2 = topfav[i + 1].id;
                    img2 = topfav[i + 1].image;
                }
                if (i + 2 < topfav.length) {
                    id3 = topfav[i + 2].id;
                    img3 = topfav[i + 2].image;
                }

                if (i == 0) {
                    arr2.push({ id1: id1, id2: id2, id3: id3, img1: img1, img2: img2, img3: img3, active: 'active' })
                }
                else {
                    arr2.push({ id1: id1, id2: id2, id3: id3, img1: img1, img2: img2, img3: img3, active: 'nonactive' })
                }
            }

            // console.log()
            res.render('index', { top5movies: arr, active: true, topBoxOffice: arr1, topfav: arr2 });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new homeController();