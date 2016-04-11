(function () {
    angular
        .module("FruitRaterApp")
        .controller("UsersFollowingController", usersFollowingController);

    usersFollowingController.$inject = ['UserService', 'PagesService', '$routeParams', '$location'];
    function usersFollowingController(UserService, PagesService, $routeParams, $location) {
        var vm = this;
        vm.$location = $location;

        // Globals
        vm.currentUser = null;
        vm.allUsersFollowing = [];
        vm.usersFollowing = [];
        vm.userPages = [];

        // Event handlers
        vm.getUsersForPage = getUsersForPage;
        vm.unfollow = unfollow;
        vm.search = search;


        init();

        // TODO: Perhaps create directives for each type of page ... this is repeated code...
        function init() {
            vm.currentUser = UserService.getCurrentUser();

            if (vm.currentUser == null) {
                $location.url('/home');
                return;
            }
            updateUsersPages();
        }

        function updateUsersPages() {
            var i;

            vm.allUsersFollowing = [];
            for (i = 0; i < vm.currentUser.usersFollowing.length; i++) {
                UserService
                    .findUserById(vm.currentUser.usersFollowing[i])
                    .then(
                        function (response) {
                            if (response.data) {
                                vm.allUsersFollowing.push(response.data);
                                vm.userPages = PagesService.splitItemsIntoPages(vm.allUsersFollowing,5);
                                vm.getUsersForPage($routeParams.page);
                            }
                        }
                    );
            }
            vm.userPages = PagesService.splitItemsIntoPages(vm.allUsersFollowing,5);
            vm.getUsersForPage($routeParams.page);
        }

        function getUsersForPage(page) {
            vm.usersFollowing = vm.userPages[page-1];
            $location.path("/profile/usersfollowing/"+ page.toString());
        }

        function unfollow(userId) {
           var index = vm.currentUser.usersFollowing.indexOf(userId);
            vm.currentUser.usersFollowing.splice(index, 1);
            UserService
                .updateUser(vm.currentUser._id, vm.currentUser)
                .then(
                    function (response) {
                        updateUsersPages();
                    }
                );

        }

        // Searches the system for the given username.
        function search(username) {
            // TODO: The userresults page should search the username in the title!
            $location.url('/profile/usersresults/' + username + '/1&');
        }

    }
})();