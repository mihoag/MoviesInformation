const review = require('../model/reviews')

class ReviewController {
    async getReviews(req, res, next) {
        try {
            //console.log(req.query.id);
            let id = req.query.id;
            let data = await review.getListReviewById(id);
            // console.log(data)
            let result = [];
            const per_page = 1;
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
            /// Tao mot mang tu 1,2..., totalPae
            res.json({ listreview: result, totalPage: totalPage, currentPage: currentPage });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new ReviewController();