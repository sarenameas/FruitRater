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
        deleteUserReviews: deleteUserReviews
    };

    return api;

    /* Creates a review in the system and returns the status */
    function createReview(review) {
        // Defensive delete id just in case it is there
        delete review._id;

        // Need to stem the fruit name so only non-plural fruits are stored in the system.
        // TODO: Verify spelling of fruit name
        //review.fruit = stem(review.fruit);

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
        ).sort({date: -1});
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
        ).sort({date: -1});
    }

    /* Returns the review from the given reviewId */
    function findReviewById(reviewId) {
        return ReviewModel.findById(reviewId);
    }

    /* Deletes the review in the system by the reviewId, returns the status. */
    function deleteReview(reviewId) {
        return ReviewModel.remove(
            {_id: reviewId}
        )
    }

    /* Deletes all the reviews for the given fruit and groceryId, returns the status. */
    function deleteFruitReviews(fruit, groceryId) {
        return ReviewModel.remove(
            {
                fruit: fruit,
                groceryId: groceryId
            }
        )
    }

    /* Deletes all the reviews for the given groceryId */
    function deleteGroceryStoreReviews(groceryId) {
        return ReviewModel.remove(
            {groceryId: groceryId}
        )
    }

    /* Deletes all the reviews for the given userId */
    function deleteUserReviews(userId) {
        return ReviewModel.remove(
            {userId: userId}
        )
    }
};