module.exports = function(db, mongoose) {
    var q = require("q");
    var bcrypt = require("bcrypt-nodejs");
    var UserSchema = require("./user.schema.server.js")(mongoose);
    var UserModel = mongoose.model('User', UserSchema);

    var api = {
        findUserByCredentials : findUserByCredentials,
        findUserById: findUserById,
        findUsersByUsername: findUsersByUsername,
        findUserByEmail: findUserByEmail,
        findAllUsers : findAllUsers,
        createUser : createUser,
        deleteUser : deleteUser,
        updateUser : updateUser
    };

    return api;

    /* Returns the user who's credentials match the username and password */
    // TODO: Consider deleting this api routine.
    function findUserByCredentials(credentials) {
        return UserModel.findOne(
            {
                email: credentials.email,
                password: credentials.password
            }
        )
    }

    /* Returns the unique user from the given userID */
    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    /* Returns an array of users with the similar usernames */
    // TODO: Use regex to find multiple users
    function findUsersByUsername(username) {
        return UserModel.find(
            {
                username: username
            }
        )
    }

    /* Returns all the users in the system */
    function findAllUsers() {
        return UserModel.find();
    }

    /* Creates a user in the system and returns the user. */
    function createUser(user) {
        var deferred = q.defer();

        // Defensive delete possible _id field in user registration.
        delete user._id;

        // Need to one way encrypt password into database.
        bcrypt
            .hashAsync(user.password)
            .then(
                function(hash) {
                    user.password = hash;
                    return UserModel.create(user);
                },
                function(err) {
                    deferred.reject(err);
                }
            );

        return deferred.promise
    }

    function findUserByEmail(email) {
        return UserModel.findOne({email: email});
    }

    /* Deletes a user in the system and returns the status of the delete. */
    function deleteUser(userId) {
        return UserModel.remove(
            {_id: userId}
        );
    }

    /* Updates the user in the system and returns the status of the update. */
    function updateUser(userId, user) {
        /* MongoDB 2.4 cannot handle the _id field being in the update. */
        delete user._id;
        if (user.location) {
            user.location = user.location.toLowerCase();
        }

        if (user.password) {
            bcrypt
                .hashAsync(user.password)
                .then (
                    function (hash) {
                        user.password = hash;
                        return UserModel.update(
                            {_id: userId},
                            {$set: user}
                        );
                    }
                )
        } else {
            return UserModel.update(
                {_id: userId},
                {$set: user}
            );
        }
    }

};