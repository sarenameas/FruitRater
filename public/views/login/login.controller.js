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
            var credentials = {
                email: vm.email,
                password: vm.password
            };

            UserService
                .login(credentials)
                .then(
                    function (response) {
                        if (response.data) {
                            var user = response.data;
                            UserService.setCurrentUser(user);
                            $location.url("/profile");
                        }
                        else {
                            alert("Incorrect Email or Password.");
                        }
                    }
                );
        }
    }
})();