(function () {
    angular
        .module("FruitRaterApp")
        .controller("ProfileReviewsController", profileReviewsController);

    profileReviewsController.$inject =
        ['$routeParams', '$location', 'ReviewService', 'GroceryService', 'UserService', 'PagesService'];
    function profileReviewsController($routeParams, $location, ReviewService, GroceryService, UserService, PagesService) {
        var vm = this; // $scope

        // Event Handlers
        vm.updateReviewPages = updateReviewPages;
        vm.getReviewsForPage = getReviewsForPage;

        // Global variables
        vm.$location = $location;
        vm.currentUser = null;
        vm.reviewPages = [];
        vm.allReviews = [];
        vm.reviews = [];
        //vm.pageNumArray = [];

        init();

        function init() {
            // Get the currentUser
            vm.currentUser = UserService.getCurrentUser();

            if (vm.currentUser == null) {
                $location.url('/home');
                return;
            }

            vm.updateReviewPages();

        }

        function updateReviewPages() {
            // TODO: Reviews should be grabbed in order by date written.
            ReviewService
                .findAllReviewsForUser(vm.currentUser._id)
                .then(
                    function (response) {
                        if (response.data) {
                            vm.allReviews = response.data;
                        }
                        else {
                            vm.allReviews = [];
                        }
                        vm.reviewPages = PagesService.splitItemsIntoPages(vm.allReviews, 5);
                        //vm.pageNumArray = PagesService.getPageNumArray(vm.reviewPages);
                        vm.getReviewsForPage($routeParams.page);
                    }
                );
        }

        /* Returns the ten reviews for the current page. */
        function getReviewsForPage(page) {
            vm.reviews = vm.reviewPages[page-1];
            // Update the path to reflect the page change.
            $location.path("/profile/myreviews/"+ page.toString());
        }


    }
})();