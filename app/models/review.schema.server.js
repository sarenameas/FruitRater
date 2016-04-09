module.exports = function(mongoose) {
    var ReviewSchema = mongoose.Schema(
        {
            "fruit": String,
            "groceryId": String,
            "userId": String,
            "rating": Number,
            "date": {type: Date, default: Date.now()},
            "text": String
        },
        {
            collection: reviews
        }
    );

    return ReviewSchema;
};