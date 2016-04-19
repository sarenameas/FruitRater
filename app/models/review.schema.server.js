module.exports = function(mongoose) {
    var ReviewSchema = mongoose.Schema(
        {
            "fruit": String,
            "groceryId": String,
            "groceryName": String, // Store grocery name to avoid searching yelp too much
            "groceryAddress": String,
            "userId": String,
            "rating": Number,
            "date": {type: Date, default: Date.now()},
            "text": String
        },
        {
            collection: "reviews"
        }
    );

    return ReviewSchema;
};