(function () {
    angular
        .module("FruitRaterApp")
        .controller("ProfileAccountController", profileAccountController);

    profileAccountController.$inject = ['UserService'];
    function profileAccountController(UserService) {
        var vm = this;

        // Get the currentUser items to fill in
        vm.currentUser = UserService.getCurrentUser();
        // There is no password error initially
        vm.passwordError = false;

        vm.profileUpdated = false;

        // Event Handlers
        vm.update = update;

        function update() {
            var updateOk = true;

            // If the two passwords match then update otherwise indicated error
            if ( vm.password != "" &&
                 vm.password != null &&
                 vm.verify != "" &&
                 vm.verify != null &&
                 vm.password !== vm.verify) {

                vm.passwordError = true;
                return;
            }
            else
            {
                vm.passwordError = false;
                if (vm.password != "" && vm.password != null) {
                    vm.currentUser.password = vm.password;
                } else {
                    delete vm.currentUser.password;
                }
                UserService
                    .updateUser(vm.currentUser._id, vm.currentUser)
                    .then(
                        function (response) {
                            vm.profileUpdated = true;
                        }
                    );
            }
        }


    }
})();