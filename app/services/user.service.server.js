module.exports = function(app, UserModel) {
    app.post("/api/login", login);
    app.post("/api/logout", logout);
    app.get("/api/loggedin", loggedin);
    app.post("/api/register", register);

    app.get("/api/user/:userId", findUserById);
    app.get("/api/user?username=username", findUsers);
    app.get("/api/user", findUsers);
    app.delete("/api/user/:userId", deleteUser);
    app.post("/api/user/:userId", updateUser);

    // TODO: Session user login stuff.
    function login() {

    }

    // TODO: Session user register stuff
    function register() {

    }

    //TODO: Passport and session stuff for logging out
    function logout() {

    }

    // TODO: Passport and session request stuff for checking loggedin
    function loggedin() {

    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    res.json(user);
                },

                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findUsers(req, res) {
        if (req.query.username) {
            UserModel
                .findUsersByUsername(req.query.username)
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function (err) {
                        res.send(400).send(err);
                    }
                );
        }
        else {
            UserModel
                .findAllUsers()
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
    }


    function deleteUser(req, res) {
        UserModel
            .deleteUser(req.params.userId)
            .then(
                function (status) {
                    res.status(200).json(status);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function updateUser(req, res) {
        UserModel
            .updateUser(req.params.userId)
            .then(
                function (status) {
                    res.status(200).json(status);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }
};