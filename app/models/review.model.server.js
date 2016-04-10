module.exports = function(db, mongoose) {
    var ReviewSchema = require("./review.schema.server.js")(mongoose);
    var ReviewModel = mongoose.model('Review', ReviewSchema);

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

    /* Creates a review in the system and returns the status */
    function createReview(review) {
        // Defenseive delete id just in case it is there
        delete review._id;

        return ReviewModel.create(review);
    }

    /* Updates the review in the system and returns the status */
    function updateReview(reviewId, review) {
        // Defensive delete of _id field.
        delete review._id;

        return ReviewModel.update(
            {_id: reviewId},
            {$set: review}
        );
    }

    /* Returns all the reviews in the system */
    function findAllReviews() {
        return ReviewModel.find();
    }

    /* Returns all the reviews for the given userID. */
    function findAllReviewsForUser(userId) {
        return ReviewModel.find(
            {userId: userId}
        )
    }

    /* Returns all the reviews the given groceryID */
    function findAllReviewsForGroceryStore(groceryId) {
        return ReviewModel.find(
            {groceryId: groceryId}
        )
    }

    /* Returns all the reviews for the given fruit and groceryStore */
    function findAllReviewsForFruitAndGroceryStore(fruit, groceryId) {
        return ReviewModel.find(
            {
                fruit: fruit,
                groceryId: groceryId
            }
        )
    }

    /* Returns the review from the given reviewId */
    function findReviewById(reviewId) {
        return ReviewModel.findById(reviewId);
    }

    /* Deletes the review in the system by the reviewId, returns the status. */
    function deleteReview(reviewId) {
        return ReviewModel.delete(
            {_id: reviewId}
        )
    }

    /* Deletes all the reviews for the given fruit and groceryId, returns the status. */
    function deleteFruitReviews(fruit, groceryId) {
        return ReviewModel.delete(
            {
                fruit: fruit,
                grocertId: groceryId
            }
        )
    }

    /* Deletes all the reviews for the given groceryId */
    function deleteGroceryStoreReviews(groceryId) {
        return ReviewModel.delete(
            {groceryId: groceryId}
        )
    }

    /* Deletes all the reviews for the given userId */
    function deleteUserReviews(userId) {
        return ReviewModel.delete(
            {userId: userId}
        )
    }

    /* Returns the average rating the all the reviews for the fruit at the given groceryId */
    function getAverageRatingOfFruitAtGroceryStore(fruit, groceryId) {
        var deferred = q.defer();
        UserModel
            .find(
                {fruit: fruit},
                {groceryId: groceryId}
            )
            .then(
                function(reviews) {
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
                function(err) {
                    deferred.reject(err);
                }
            );
        return deferred.promise;
    }
};