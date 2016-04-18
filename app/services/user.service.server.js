var passport = require('passport');
var LocalStrategy = require('passport-local');
var bcrypt = require("bcrypt-nodejs");
var multer = require("multer");
var fs = require("fs");

module.exports = function(app, UserModel) {
    var uploadMulter = multer({
        dest: __dirname+'/../../public/pictures',
        limits: {
            files: 1,
            fileSize: 100000
        }
    });
    var upload = uploadMulter.single('picFile');

    var auth = authorized;

    app.post("/api/login", passport.authenticate('local'), login);
    app.post("/api/logout", logout);
    app.get("/api/loggedin", loggedin);
    app.post("/api/register", register);

    app.post("/api/user", auth, createUser);
    app.get("/api/user/:userId", auth, findUserById);
    app.get("/api/user?username=username", auth, findUsers);
    app.get("/api/user", auth, findUsers);
    app.delete("/api/user/:userId", auth, deleteUser);
    app.put("/api/user/:userId", auth, updateUser);

    app.post("/api/upload", uploadImage);

    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function localStrategy(email, password, done) {
        // Local strategy expects a username, but I will be using an email to log in instead.
        UserModel
            .findUserByEmail(email)
            .then (
                function (user) {
                    if (!user) {
                        return done(null, false);
                    } else {
                        bcrypt.compare(password, user.password, function (err, res) {
                            if (res) {
                                return done(null, user)  ;
                            } else {
                                return done(null, false);
                            }
                        })
                    }
                },
                function (err) {
                    if (err) {
                        return done(err, null);
                    }
                }
            );
    }

    // Tell passport which object to serialize
    function serializeUser(user, done) {
        done(null, user);
    }

    // Retrieve the user object from the system.
    function deserializeUser(user, done) {
        UserModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function authorized(req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function login(req, res) {
        var user = req.user;
        user.password = null;
        res.json(user);
    }


    function register(req, res) {
        var newUser = req.body;
        // Thwart attempts to make a hacker into an admin
        newUser.admin = false;
        // Find if this email exists and if it does don't login.
        UserModel
            .findUserByEmail(newUser.email)
            .then(
                function (user) {
                    if (user) {
                        res.json(null);
                    } else {
                        return UserModel.createUser(newUser);
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (user) {
                    if (user) {
                        req.login(user, function(err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : null);
    }

    function createUser(req, res) {
        var newUser = req.body;
        UserModel
            .createUser(newUser)
            .then(
                function (status) {
                    res.json(status);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
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
        var user = req.body;
        var userId = req.params.userId;
        UserModel
            .updateUser(userId, user)
            .then(
                function (status) {
                    res.status(200).json(status);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    // Returns true if the user is an admin, returns false otherwise.
    function isAdmin(user) {
        return user.admin;
    }


    function uploadImage(req, res) {

        upload(req, res, function (err) {
            if (err) {
                res.status(400).send("Image file size limit is 100kB. Please try again")
            } else {
                var picFile = req.file;
                var userId = req.body.userId;

                console.log(picFile);
                console.log(userId);

                if (picFile) {
                    var destination   = picFile.destination;
                    var path          = picFile.path;
                    var originalname  = picFile.originalname;
                    var size          = picFile.size;
                    var mimetype      = picFile.mimetype;
                    var filename      = picFile.filename;
                }

                // We must check for a valid upload, else delete from our system!
                if (!mimetype.includes("image") || size > 100000) {
                    fs.unlink(path, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(400).send(err);
                        } else {
                            res.status(200).send("File too large and images only");
                        }
                    });
                } else {
                    var userUpdates = {
                        "picture": "../../../pictures/" + filename
                    };
                    // Delete old picture from the system and then update the user.
                    UserModel
                        .findUserById(userId)
                        .then(
                            function (user) {
                                if (user.picture) {
                                    // Get the user picture filename from the string
                                    var oldfilename = user.picture.slice(18);
                                    fs.unlink(destination + "/" + oldfilename, function (err) {
                                        // An error just means the picture was not found.
                                        return UserModel.updateUser(userId, userUpdates);
                                    });
                                } else {
                                    return UserModel.updateUser(userId, userUpdates);
                                }
                            },
                            function (err) {
                                res.status(400).send(err);
                            }
                        )
                        .then(
                            function (status) {
                                res.redirect('/#/profile');
                            },
                            function (err) {
                                res.status(400).send(err);
                            }
                        );
                }
            }
        });

    }

};