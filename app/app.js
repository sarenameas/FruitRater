module.exports = function(app, mongoose, db) {
    var UserModel = require('./models/user.model.server.js')(db, mongoose);
    var ReviewModel = require('./models/review.model.server.js')(db, mongoose);

    var UserService = require('./services/user.service.server.js')(app, UserModel);
    var ReviewService = require('./services/review.service.server.js')(app, ReviewModel);
    var YelpService = require('./services/yelp.service.server')(app);
};