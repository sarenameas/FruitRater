(function () {
    angular
        .module("FruitRaterApp")
        .controller("ProfileHeaderController", profileHeaderController);

    profileHeaderController.$inject = ['$location', 'UserService'];
    function profileHeaderController($location, UserService) {
        var vm = this;
        vm.$location = $location;

        // TODO: Get current user from the UserService
        vm.currentUser = UserService.getCurrentUser();

        // Go to the home page if the current user is not logged in.
        // TODO: Need to use passport.js
        if (!vm.currentUser) {
            $location.url("/home");
        }

    }
})();