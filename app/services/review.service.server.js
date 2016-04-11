module.exports = function(app, ReviewModel) {
    app.post("/api/review", createReview);
    app.put("/api/review/:reviewId", updateReview);
    app.get("/api/review", findReviews);
    app.get("/api/review?userId=userId", findReviews);
    app.get("/api/review?groceryId=groceryId", findReviews);
    app.get("/api/review?groceryId=groceryId&fruit=fruit", findReviews);
    app.get("/api/review/:reviewId", findReviewById);
    app.delete("/api/review/:reviewId", deleteReview);
    app.delete("/api/review?groceryId=groceryId&fruit=fruit", deleteReviews);
    app.delete("/api/review?groceryId=groceryId", deleteReviews);
    app.delete("/api/review?userId=userId", deleteReviews);


    function createReview(req, res) {
        var newReview = req.body;
        ReviewModel
            .createReview(newReview)
            .then(
                function (review) {
                    res.json(review);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function updateReview(req, res) {
        var review = req.body;
        var reviewId = req.params.reviewId;
        ReviewModel
            .updateReview(reviewId, review)
            .then(
                function (status) {
                    res.status(200).json(status);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findReviews(req, res) {
        if(req.query.userId) {
            ReviewModel
                .findAllReviewsForUser(req.query.userId)
                .then(
                    function (reviews) {
                        res.json(reviews);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
        else if (req.query.groceryId && req.query.fruit) {
            ReviewModel
                .findAllReviewsForFruitAndGroceryStore(req.query.fruit, req.query.groceryId)
                .then(
                    function (reviews) {
                        res.json(reviews);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
        else if (req.query.groceryId) {
            ReviewModel
                .findAllReviewsForGroceryStore(req.query.groceryId)
                .then(
                    function (reviews) {
                        res.json(reviews);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
        else {
            ReviewModel
                .findAllReviews()
                .then(
                    function (reviews) {
                        res.json(reviews);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
    }

    function findReviewById(req, res) {
        ReviewModel
            .findReviewById(req.params.reviewId)
            .then(
                function (review) {
                    res.json(review);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function deleteReview(req, res) {
        ReviewModel
            .deleteReview(req.params.reviewId)
            .then(
                function (status) {
                    res.status(200).json(status);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function deleteReviews(req, res) {

        if (req.query.userId) {
            ReviewModel
                .deleteUserReviews(req.query.userId)
                .then(
                    function (status) {
                        res.status(200).json(status);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
        else if (req.query.groceryId && req.query.fruit) {
            ReviewModel
                .deleteFruitReviews(req.query.fruit, req.query.groceryId)
                .then(
                    function (status) {
                        res.status(200).json(status);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
        else if (req.query.groceryId) {
            ReviewModel
                .deleteGroceryStoreReviews(req.query.groceryId)
                .then(
                    function (status) {
                        res.status(200).json(status);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
    }

};