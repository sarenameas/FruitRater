(function () {
    angular
        .module("FruitRaterApp")
        .factory("UserService", userService);


    userService.$inject = ['$rootScope', '$http'];
    function userService($rootScope, $http) {

        var api = {
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

        function login(user) {
            console.log(user);
            return $http.post("/api/login", user);
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function findUserById(userId) {
            return $http.get("/api/user/" + userId);
        }

        function findUsersByUsername(username) {
            return $http.get("/api/user?username=" + username);
        }


        function findAllUsers() {
            return $http.get("/api/user");
        }


        function createUser(user) {
            return $http.post("/api/user", user);
        }


        function deleteUser(userId) {
            return $http.delete("/api/user/" + userId);
        }


        function updateUser(userId, user) {
            return $http.put("/api/user/" + userId, user);
        }
    }
})();