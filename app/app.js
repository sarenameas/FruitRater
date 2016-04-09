module.exports = function(app, mongoose, db) {
    var UserModel = require('./models/user.model.server.js')(db, mongoose);
    var ReviewModel = require('./models/review.model.server.js')(db, mongoose);


};