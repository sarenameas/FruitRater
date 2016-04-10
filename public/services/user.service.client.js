(function () {
    angular
        .module("FruitRaterApp")
        .factory("UserService", userService);


    userService.$inject = ['$rootScope', '$http'];
    function userService($rootScope, $http) {

        // TODO: Mock data for now
        var users = [
            {
                "_id": "123",
                "username": "Jackson Galaxy",
                "email": "jgalaxy@email.com",
                "password": "cats",
                "joinedDate": new Date(2015, 1, 13),
                "admin": false,
                "picture": "pictures/jackson_galaxy.jpg",
                "usersFollowing": [ 456 ],
                "groceryStoresFollowing": [ 1 ],
                "location": "kirkland, wa"

            },
            {
                "_id": "456",
                "username": "cplusplus",
                "email": "cplusplus@email.com",
                "password": "helloworld",
                "joinedDate": new Date(2015, 1, 10),
                "admin": true,
                "picture": "pictures/cplusplus.png",
                "usersFollowing": [],
                "groceryStoresFollowing": [ 1 ],
                "location": "kirkland, wa"
            }
        ];


        // API
        var api = {
            users: users,
            getCurrentUser : getCurrentUser,
            setCurrentUser : setCurrentUser,
            login: login,
            register: register,
            findUserById: findUserById,
            findUsersByUsername: findUsersByUsername,
            findAllUsers : findAllUsers,
            createUser : createUser,
            deleteUser : deleteUser,
            updateUser : updateUser
        };
        return api;


        // Returns the currentUser logged in the system.
        function getCurrentUser() {
            return $rootScope.currentUser;
        }

        // Sets the currentUser logged in the system to the given user. The given user must be a valid user object.
        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }

        function login(credentials) {
            return $http.post("/api/login", credentials);
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        // Returns the user found by the given userId.
        function findUserById(userId) {
            return $http.get("/api/user/:userId");
        }

        function findUsersByUsername(username) {
            var usersFound = [];
            for (i = 0; i < users.length; i++) {
                if (users[i].username === username) {
                    usersFound.push(users[i]);
                }
            }
            return usersFound;

        }

        // Returns the array of users to the callback function.
        function findAllUsers() {
            return users;
        }

        // Returns the new user after creating it.
        function createUser(user) {
            var newUser = {
                "_id": (new Date).getTime().toString(),
                "username": user.username,
                "email": user.email,
                "password": user.password,
                "joinedDate": new Date(),
                "admin": false,
                "picture": "pictures/profile_picture.png",
                "usersFollowing": [],
                "groceryStoresFollowing": [],
                "location": null
            }
            users.push(newUser);
            return newUser;
        }

        // Returns the user array after the user with the given email is deleted.
        function deleteUser(userId) {
            var i;
            // Iterate through the users array looking for a matching _id
            for (i = 0; i < users.length; i++) {
                if (users[i]._id === userId) {
                    users.splice(i, 1); // splice(i,1) deletes one user at location i
                }
            }

            return users;

        }

        // Returns the updated user, found with userIsd and updated with user fields.
        // userId must exist in the array of users.
        function updateUser(userId, user) {
            var i;
            // Iterate through the users array looking for a matching _id
            for (i = 0; i < users.length; i++) {
                if (users[i]._id === userId) {
                    users[i].username = user.username;
                    users[i].password = user.password;
                    users[i].email = user.email;
                    // TODO: How to upload profile pictures????
                    users[i].picture = user.picture;
                    users[i].usersFollowing = user.usersFollowing;
                    users[i].groceryStoresFollowing = user.groceryStoresFollowing;
                    users[i].location = user.location.toLowerCase();

                    return users[i];
                }
            }

        }
    }
})();