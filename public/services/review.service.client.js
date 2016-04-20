(function () {
    angular
        .module("FruitRaterApp")
        .factory("ReviewService", reviewService);

    reviewService.$inject = ['$http', '$q'];
    function reviewService($http, $q) {
        var api = {
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
            return $http.delete("/api/review/" + reviewId);
        }

        function deleteFruitReviews(fruit, groceryId) {
            return $http.delete("/api/review/groceryId/" + groceryId + "/fruit/" + fruit);
        }

        function deleteGroceryStoreReviews(groceryId) {
            return $http.delete("/api/review/groceryId/" + groceryId);
        }

        function deleteUserReviews(userId) {
            return $http.delete("/api/review/userId/" + userId);
        }

        function findAllReviewsForGroceryStore(groceryId) {
            return $http.get("/api/review?groceryId=" + groceryId);
        }

        /* Returns the average rating of all the fruits reviews for the given grocery store id. */
        function getAverageRatingOfFruitAtGroceryStore(fruit, groceryId) {
            var deferred = $q.defer();
            findAllReviewsForFruitAndGroceryStore(fruit, groceryId)
                .then(
                    function (response) {
                        var reviews = response.data;
                        var i;
                        var sum = 0;
                        var count = 0;
                        var average = 0;
                        for(i = 0; i < reviews.length; i++) {
                            sum += reviews[i].rating;
                            count += 1;
                        }
                        if(count !== 0) {
                            average = Math.floor(sum/count);
                        }
                        deferred.resolve(average);
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );

            return deferred.promise;
        }


        function findAllReviewsForFruitAndGroceryStore(fruit, groceryId) {
            return $http.get("/api/review?groceryId=" + groceryId + "&fruit=" + fruit);
        }
    }
})();