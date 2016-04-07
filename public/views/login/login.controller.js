(function () {
    angular
        .module("FruitRaterApp")
        .controller("LoginController", loginController);

    loginController.$inject = ['$location', 'UserService'];
    function loginController($location, UserService) {
        var vm = this;

        // Event Handlers
        vm.login = login;

        // Logs the user in if the username and password match.
        function login() {
            // TODO: Need to use promises and server
            var user = UserService.findUserByCredentials(vm.email, vm.password);

            // If the user is not in the system then alert incorrect username or password.
            // Otherwise set the current user and navigate to the profile page.
            if (user == null) {
                alert("Incorrect Username or Password.");
            }
            else {
                UserService.setCurrentUser(user);
                $location.url("/profile");
            }

        }
    }
})();