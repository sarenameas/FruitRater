(function () {
    angular
        .module("FruitRaterApp")
        .controller("UserReviewsController", userReviewsController);

    userReviewsController.$inject =
        ['$routeParams', '$location', 'ReviewService', 'GroceryService', 'UserService', 'PagesService'];
    function userReviewsController($routeParams, $location, ReviewService, GroceryService, UserService, PagesService) {
        var vm = this; // $scope

        // Event Handlers
        vm.updateReviewPages = updateReviewPages;
        vm.getReviewsForPage = getReviewsForPage;
        vm.getGroceryStoreName = getGroceryStoreName;
        vm.getGroceryStoreAddress = getGroceryStoreAddress;

        // Global variables
        vm.$location = $location;
        vm.user = null;
        vm.reviewPages = [];
        vm.allReviews = [];
        vm.reviews = [];

        init();

        function init() {
            // Get the currentUser
            UserService
                .findUserById($routeParams.id)
                .then(
                    function (response) {
                        if (response.data) {
                            vm.user = response.data;
                        }
                    }
                );

            vm.updateReviewPages();

        }

        function updateReviewPages() {
            // We need to get 10 reviews at a time from the server for the view
            // TODO: Reviews should be grabbed in order by date written.
            // Get the reviews to display without promises for now.
            vm.allReviews = ReviewService.findAllReviewsForUser(vm.user._id);
            vm.reviewPages = PagesService.splitItemsIntoPages(vm.allReviews, 5);
            vm.getReviewsForPage($routeParams.page);
        }

        /* Returns the ten reviews for the current page. */
        function getReviewsForPage(page) {
            vm.reviews = vm.reviewPages[page-1];
            // Update the path to reflect the page change.
            $location.path("/user/" + vm.user._id.toString() + "/reviews/" + page.toString());
        }

        function getGroceryStoreName(groceryId) {
            var name = GroceryService.findGroceryStoreById(groceryId).name;
            name = name.charAt(0).toUpperCase() + name.slice(1);
            return name;
        }

        function getGroceryStoreAddress(groceryId) {
            var address = GroceryService.findGroceryStoreById(groceryId).address;
            return address;
        }


    }
})();