(function () {
    angular
        .module("FruitRaterApp")
        .controller("UserResultsController", userResultsController);

    userResultsController.$inject = ['$routeParams', '$location', 'UserService', 'PagesService'];
    function userResultsController($routeParams, $location, UserService, PagesService) {
        var vm = this;


        // Even Handlers
        vm.follow = follow;
        vm.getUsersFoundForPage = getUsersFoundForPage;

        // Globals
        vm.$location = $location;
        vm.username = $routeParams.username;
        vm.currentUser = null;
        vm.allusersFound = [];
        vm.usersFoundPages = [];
        vm.usersFound = [];


        init();

        function init() {
            vm.currentUser = UserService.getCurrentUser();

            if (vm.currentUser == null) {
                vm.$location.url('/home');
                return;
            }

            updateUsersFoundPages();
        }


        function updateUsersFoundPages() {
            var i;

            vm.allUsersFound = [];
            UserService
                .findUsersByUsername(vm.username)
                .then(
                    function (response) {
                        vm.allUsersFound = response.data;
                        vm.usersFoundPages = PagesService.splitItemsIntoPages(vm.allUsersFound,5);
                        vm.getUsersFoundForPage($routeParams.page);
                    }
                );
        }

        /* Expects a integer page */
        function getUsersFoundForPage(page) {
            vm.usersFound = vm.usersFoundPages[page-1];
            $location.path("/profile/usersresults/" + vm.username + "/" + page.toString() + "&");
        }

        function follow(userId) {
            // TODO: Cannot follow a user more than once... need to disable button (doesnt work in IE11)
            var index = vm.currentUser.usersFollowing.indexOf(userId);
            // If we are not currently following this user then add them to the list.
            if (index == -1) {
                vm.currentUser.usersFollowing.push(userId);
                UserService
                    .updateUser(vm.currentUser._id, vm.currentUser)
                    .then(
                        function (response) {
                            updateUsersFoundPages();
                        }
                    );
            }
        }
    }
})();