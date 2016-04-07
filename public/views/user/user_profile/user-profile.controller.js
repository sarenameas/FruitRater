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
            vm.user = UserService.findUserById($routeParams.id);
            vm.currentUser = UserService.getCurrentUser();
            var userReviews = ReviewService.findAllReviewsForUser(vm.user._id);
            vm.numReviews = userReviews.length;

            if (vm.currentUser == null) {
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

        function follow(userId) {
            if (vm.currentUser != null) {
                if (vm.currentUser.usersFollowing.indexOf(userId) === -1) {
                    vm.currentUser.usersFollowing.push(userId);
                    UserService.updateUser(vm.currentUser._id, vm.currentUser);
                    // Need to reinit the page to propagate changes.
                    init();
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
                    UserService.updateUser(vm.currentUser._id, vm.currentUser);
                    // Need to reinit the page to propagate changes tp view.
                    init();
                }
            }
            vm.unfollowVisible = false;
            vm.followVisible = true;
        }
    }
})();