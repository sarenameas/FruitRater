(function () {
    angular
        .module("FruitRaterApp")
        .controller("AllUsersController", allUsersController);

    allUsersController.$inject = ['UserService']
    function allUsersController(UserService) {
        var vm = this;

        // Global variables
        vm.users = [];
        vm.user = {};
        vm.selectedUser = null;
        vm.usernameArrowDown = true;

        // Event Handlers
        vm.addUser = addUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.selectUser = selectUser;
        vm.sortByUsername = sortByUsername;

        init();

        function init() {
            UserService
                .findAllUsers()
                .then(
                    function(response) {
                        if (response.data) {
                            vm.users = response.data;
                            var i;
                        }
                    }
                );
        }

        function addUser(user) {
            // Must have a username and password to create a user
            if (user.username && user.password) {
                // Admin role is string when entered in the ng-model
                if (user.admin && user.admin.toLowerCase === "true") {
                    user.admin = true;
                } else {
                    user.admin = false;
                }

                UserService
                    .createUser(user)
                    .then(
                        function(response) {
                            if (response.data) {
                                var newUser = response.data;
                                vm.users.push(newUser);
                                vm.user = {}
                            }
                        }
                    )
            }
        }

        function updateUser(user) {
            if (vm.selectedUser != null &&
                user.username != "" &&
                user.username != null)
            {
                if (user.password == null || user.password == "") {
                    delete user.password;
                }
                UserService
                    .updateUser(user._id, user)
                    .then(
                        function(response) {
                            // This will return status
                            vm.selectedUser.username = user.username;
                            vm.selectedUser.password = user.password;
                            vm.selectedUser.email = user.email;
                            vm.selectedUser.admin = user.admin;
                            vm.selectedUser = {};
                            vm.user = {};
                        }
                    );
            }

        }

        function deleteUser(user, $index) {
            UserService
                .deleteUser(user._id)
                .then(
                    function (response) {
                        vm.users.splice($index, 1);
                    }
                );
        }


        function selectUser(user) {
            vm.selectedUser = user;

            // In javascript all variables are passed by reference so need to copy selectedUser to User
            // to avoid updates happening at the same time in the table.
            vm.user = {
                "_id": user._id,
                "username": user.username,
                "password": null,
                "email": user.email,
                "admin": user.admin
            };
        }


        function sortByUsername() {
            // If the arrow is down then we are sorted in decscending order
            // If the arrow is up the we are sorted in ascending order.
            if (vm.usernameArrowDown) {
                // Currently in descending order so make ascending order.
                vm.users = vm.users.sort(compareUsernameAscending);

                vm.usernameArrowDown = false;
            } else {
                // Currently in ascending order so make descending order.
                vm.users = vm.users.sort(compareUsernameDescending);
                vm.usernameArrowDown = true;
            }
        }

        // Given two users, a and b, compare their username field.
        // This will sort in ascending order.
        function compareUsernameAscending(a, b) {

            if (a.username.toLowerCase() < b.username.toLowerCase()) {
                return -1;
            }
            if (a.username.toLowerCase() > b.username.toLowerCase()) {
                return 1;
            }
            // a must be equal to b
            return 0;
        }

        function compareUsernameDescending(a, b) {

            if (a.username.toLowerCase() > b.username.toLowerCase()) {
                return -1;
            }
            if (a.username.toLowerCase() < b.username.toLowerCase()) {
                return 1;
            }
            // a must be equal to b
            return 0;
        }
    }
})();