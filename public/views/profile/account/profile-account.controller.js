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
        // TODO: This logic probably shouldnt be here???
        vm.passwordError = false;

        // Event Handlers
        vm.update = update;
        vm.upload = upload;


        function update() {
            var updateOk = true;

            // If the two passwords match then update otherwise indicated error
            if ( vm.password == null ||
                 vm.password === "" ||
                 vm.verify == null ||
                 vm.verify === ""  ||
                 ( vm.password !== vm.verify ) ) {

                vm.passwordError = true;
                return;
            }
            else
            {
                vm.currentUser.password = vm.password;
                UserService
                    .updateUser(vm.currentUser._id, vm.currentUser)
                    .then(
                        function (response) {
                            alert("Updated user profile.");
                        }
                    );
            }
        }


        // TODO: How to upload a picture to the server...????
        function upload() {
            // Do something with vm.path
            console.log(vm.path);
        }


    }
})();