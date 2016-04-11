(function () {
    angular
        .module("FruitRaterApp")
        .factory("ReviewService", reviewService);

    reviewService.$inject = ['$http'];
    function reviewService($http) {
        // Mock data
        var reviews = [
            {
                "_id": 1,
                "fruit": "avacado",
                "groceryId": "1",
                "userId": "123",
                "rating": 3,
                "date": new Date(2015, 1, 13),
                "text": "Ok, had black stringy stuff inside."
            },
            {
                "_id": 2,
                "fruit": "avacado",
                "groceryId": "1",
                "userId": "456",
                "rating": 1,
                "date": new Date(2015, 1, 10),
                "text": "def no"
            },
            {
                "_id": 3,
                "fruit": "avacado",
                "groceryId": "1",
                "userId": "456",
                "rating": 5,
                "date": new Date(2015, 1, 10),
                "text": "no"
            },
            {
                "_id": 4,
                "fruit": "avacado",
                "groceryId": "1",
                "userId": "456",
                "rating": 2,
                "date": new Date(2015, 1, 10),
                "text": "ok"
            }
        ];

        // API to return
        var api = {
            reviews: reviews,
            createReview: createReview,
            updateReview: updateReview,
            findAllReviews: findAllReviews,
            findAllReviewsForUser: findAllReviewsForUser,
            findAllReviewsForGroceryStore: findAllReviewsForGroceryStore,
            findAllReviewsForFruitAndGroceryStore: findAllReviewsForFruitAndGroceryStore,
            findReviewById: findReviewById,
            deleteReview: deleteReview,
            deleteFruitReviews: deleteFruitReviews,
            deleteGroceryStoreReviews: deleteGroceryStoreReviews,
            deleteUserReviews: deleteUserReviews,
            getAverageRatingOfFruitAtGroceryStore: getAverageRatingOfFruitAtGroceryStore
        };

        return api;

        function createReview(review) {
            return $http.post("/api/review", review);
        }

        function updateReview(reviewId, review) {
            return $http.put("/api/review/" + reviewId, review);
        }

        function findAllReviews() {
            return $http.get("/api/review");
        }

        function findAllReviewsForUser(userId) {
            return $http.get("/api/review?userId=" + userId);
        }


        function findReviewById(reviewId) {
            return $http.get("/api/review/" + reviewId);
        }

        function deleteReview(reviewId) {
            var i;
            for(i=0; i < reviews.length; i++) {
                if (reviews[i]._id === reviewId) {
                    reviews.splice(i, 1);
                }
            }
        }

        /* Deletes all of the specified fruit for that grocery store */
        function deleteFruitReviews(fruit, groceryId) {
            var i;
            for(i= reviews.length - 1; i >= 0 ; i--) {
                if (reviews[i].fruit === fruit && reviews[i].groceryId === groceryId) {
                    reviews.splice(i, 1);
                }
            }
            return reviews;
        }

        function deleteGroceryStoreReviews(groceryId) {
            var i;
            for(i= reviews.length - 1; i >= 0 ; i--) {
                if (reviews[i].groceryId === groceryId) {
                    reviews.splice(i, 1);
                }
            }
        }

        /* Deletes all the reviews for that user */
        function deleteUserReviews(userId) {
            var i;
            for(i= reviews.length - 1; i >= 0 ; i--) {
                if (reviews[i].userId === userId) {
                    reviews.splice(i, 1);
                }
            }
        }


        
        /* Get all the review sin the server for the specified grocery store id */
        function findAllReviewsForGroceryStore(groceryId) {
            var i;
            var groceryReviews = [];
            for (i = 0; i < reviews.length; i++) {
                if (reviews[i].groceryId === groceryId) {
                    groceryReviews.push(reviews[i]);
                }
            }
            return groceryReviews;
        }

        /* Returns the average rating of all the fruits reviews for the given grocery store id. */
        function getAverageRatingOfFruitAtGroceryStore(fruit, groceryId) {
            var i;
            var sum = 0;
            var count = 0;
            var average = 0;
            for(i = 0; i < reviews.length; i++) {
                if (reviews[i].fruit === fruit && reviews[i].groceryId === groceryId) {
                    sum += reviews[i].rating;
                    count += 1;
                }
            }
            if(count !== 0) {
                average = Math.floor(sum/count);
            }
            return average;
        }


        function findAllReviewsForFruitAndGroceryStore(fruit, groceryId) {
            var fruitReviews = [];
            for(i = 0; i < reviews.length; i++) {
                if (reviews[i].fruit === fruit && reviews[i].groceryId === groceryId) {
                    fruitReviews.push(reviews[i]);
                }
            }

            return fruitReviews;
        }
    }
})();