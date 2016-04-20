(function () {
    angular
        .module("FruitRaterApp")
        .controller("RegisterController", registerController);

    registerController.$inject = ['$location','UserService'];
    function registerController($location, UserService) {
        var vm = this;
        vm.$location = $location;

        // For blank usernames
        vm.usernameError = false;
        vm.passwordError = false;
        vm.verifyError = false;
        vm.emailError = false;

        vm.registerError = false;
        vm.emailExists = false;

        // Event handlers
        vm.register = register;

        function register() {
            var registerOk = true;

            if (vm.username == null || vm.username === "") {
                vm.usernameError = true;
                registerOk = false;
            }
            else {
                vm.usernameError = false;
            }

            if (vm.password == null || vm.password === "") {
                vm.passwordError = true;
                registerOk = false;
            }
            else {
                vm.passwordError = false;
            }

            if (vm.verify == null || vm.verify === "") {
                vm.verifyError = true;
                registerOk = false;
            }
            else {
                vm.verifyError = false;
            }

            if (vm.email == null || vm.email === "") {
                vm.emailError = true;
                registerOk = false;
            }
            else {
                vm.emailError = false;
            }

            if (registerOk) {
                if (vm.password !== vm.verify) {
                    vm.passwordError = true;
                    vm.verifyError = true;
                }
                else {
                    vm.passwordError = false;
                    vm.verifyError = false;

                    var user = {
                        "username": vm.username,
                        "password": vm.password,
                        "email": vm.email,
                        "firstname": null,
                        "lastname": null,
                    };

                    UserService
                        .register(user)
                        .then(
                            function (response) {
                                if (response.data) {
                                    vm.registerError = false;
                                    vm.emailExists = false;
                                    var userResponse = response.data;
                                    UserService.setCurrentUser(userResponse);
                                    $location.url("/profile");
                                } else {
                                    vm.emailExists = true;
                                }
                            },
                            function (err) {
                                vm.registerError = true;
                            }
                        );
                }
            }

        }
    }
})();