const actor = require('../model/actor')

class SearchActorController {
    async searchActor(req, res, next) {
        try {
            let keyword = req.body.keyword;
            if (keyword === undefined) {
                keyword = req.query.keyword;
            }

            let data = await actor.searchActorByName(keyword)

            ///
            let result = [];
            const per_page = 5;
            let totalPage = parseInt(data.length) / parseInt(per_page);
            if (data.length % per_page != 0) {
                totalPage++;
            }
            let currentPage = req.query.currentPage;
            if (currentPage === undefined) {
                currentPage = 1;
            }
            let start = (currentPage - 1) * per_page;
            for (let i = start; i < start + per_page; i++) {
                if (i >= data.length) {
                    break;
                }
                result.push(data[i]);
            }
            /// Tao mot mang tu 1,2..., totalPage
            let pages = [];
            for (let i = 1; i <= totalPage; i++) {
                if (i == parseInt(currentPage)) {
                    pages.push({ index: i, active: 'active' });
                }
                else {
                    pages.push({ index: i, active: 'nonactive' });
                }
            }
            res.render('searchActor', {
                listActor: result, pages: pages, currentPage: currentPage, keyword: keyword, active: true, nonactive: false
            });
            // res.render('searchActor', { listActor: data });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new SearchActorController();