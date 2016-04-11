/*

If user doesn't exist reviews will still exist.

 */

module.exports = function(db, mongoose) {
    var q = require("q");
    var UserSchema = require("./user.schema.server.js")(mongoose);
    var UserModel = mongoose.model('User', UserSchema);

    var api = {
        findUserByCredentials : findUserByCredentials,
        findUserById: findUserById,
        findUsersByUsername: findUsersByUsername,
        findAllUsers : findAllUsers,
        createUser : createUser,
        deleteUser : deleteUser,
        updateUser : updateUser
    };

    return api;

    /* Returns the user who's credentials match the username and password */
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

    /* Creates a user in the system and returns the newly created user or a rejection. */
    function createUser(user) {
        var deferred = q.defer();

        // Defensive delete possible _id field
        delete user._id;

        /* Need to check for an existing username */
        return UserModel
            .findOne({email: user.email})
            .then(
                function (result) {
                    if (result) {
                        deferred.reject("User for this email already exists");
                    } else {
                        UserModel.create(user, function (err, doc) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                /* This doc from the Database is the newly created user!*/
                                deferred.resolve(doc);
                            }
                        });
                    }
                },
                function (err) {
                    deferred.reject(err);
                }
            );

        return deferred.promise
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
        return UserModel.update(
            {_id: userId},
            {$set: user}
        );
    }

};