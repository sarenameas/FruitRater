(function () {
    angular
        .module("FruitRaterApp")
        .controller("UserProfileController", userProfileController);

    userProfileController.$inject = ['$routeParams', 'UserService', 'ReviewService'];
    function userProfileController($routeParams, UserService, ReviewService) {
        var vm = this;

        // Global Variables
        vm.user = null;
        vm.currentUser = null;
        vm.numReviews = 0;
        vm.unfollowVisible = false;
        vm.followVisisible = false;

        // Event Handlers
        vm.follow = follow;
        vm.unfollow = unfollow;


        init();

        function init() {
            UserService
                .findUserById($routeParams.id)
                .then(
                    function (response) {
                        if (response.data) {
                            vm.user = response.data;
                            return ReviewService.findAllReviewsForUser(vm.user._id);
                        }
                    }
                )
                .then (
                    function (response) {
                        if (response.data) {
                            var userReviews = response.data;
                            vm.numReviews = userReviews.length;

                            vm.currentUser = UserService.getCurrentUser();

                            if (vm.currentUser == null) {
                                vm.unfollowVisible = false;
                                vm.followVisible = false;
                            }
                            else if (vm.currentUser._id === vm.user._id) {
                                vm.unfollowVisible = false;
                                vm.followVisible = false;
                            }
                            else if (vm.currentUser.usersFollowing.indexOf(vm.user._id) > -1) {
                                vm.unfollowVisible = true;
                                vm.followVisible = false;
                            }
                            else {
                                vm.unfollowVisible = false;
                                vm.followVisible = true;
                            }
                        }
                    }
                );


        }

        function follow(userId) {
            if (vm.currentUser != null) {
                if (vm.currentUser.usersFollowing.indexOf(userId) === -1) {
                    vm.currentUser.usersFollowing.push(userId);
                    delete vm.currentUser.password;
                    UserService
                        .updateUser(vm.currentUser._id, vm.currentUser)
                        .then(
                            function (response) {
                                // Need to re-init to propagate changes.
                                init();
                            }
                        )

                }
            }
            vm.unfollowVisible = true;
            vm.followVisible = false;
        }

        function unfollow(userId) {
            if (vm.currentUser != null) {
                var index = vm.currentUser.usersFollowing.indexOf(userId);
                if (index > -1) {
                    vm.currentUser.usersFollowing.splice(index, 1);
                    delete vm.currentUser.password;
                    UserService
                        .updateUser(vm.currentUser._id, vm.currentUser)
                        .then(
                            function (response) {
                                // Need to reinit the page to propagate changes tp view.
                                init();
                            }
                        );

                }
            }
            vm.unfollowVisible = false;
            vm.followVisible = true;
        }
    }
})();