(function () {
    angular
        .module("FruitRaterApp")
        .controller("LoginController", loginController);

    loginController.$inject = ['$location', 'UserService'];
    function loginController($location, UserService) {
        var vm = this;

        vm.incorrect = false;

        // Event Handlers
        vm.login = login;

        // Logs the user in if the email and password match.
        function login() {
            // *The local strategy expects a username credential.
            var credentials = {
                "username": vm.email,
                "password": vm.password
            };

            UserService
                .login(credentials)
                .then(
                    function (response) {
                        if (response.data) {
                            vm.incorrect = false;
                            var user = response.data;
                            UserService.setCurrentUser(user);
                            $location.url("/profile");
                        }
                        else {
                            vm.incorrect = true;
                            console.log("Incorrect email or password");
                        }
                    },
                    function (err) {
                        console.log("Incorrect email or password");
                        vm.incorrect = true;
                    }
                );
        }
    }
})();