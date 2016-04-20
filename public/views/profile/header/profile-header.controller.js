(function () {
    angular
        .module("FruitRaterApp")
        .controller("ProfileHeaderController", profileHeaderController);

    profileHeaderController.$inject = ['$location', 'UserService'];
    function profileHeaderController($location, UserService) {
        var vm = this;
        vm.$location = $location;

        vm.currentUser = UserService.getCurrentUser();

        // Go to the home page if the current user is not logged in.
        if (!vm.currentUser) {
            $location.url("/home");
        }

    }
})();