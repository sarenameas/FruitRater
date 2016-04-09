(function () {
    angular
        .module("FruitRaterApp")
        .controller("FruitController", fruitController);

    fruitController.$inject = ['$routeParams', '$location', 'GroceryService', 'ReviewService', 'UserService', 'PagesService'];
    function fruitController($routeParams, $location, GroceryService, ReviewService, UserService, PagesService) {
        var vm = this;

        // Globals
        vm.$location = $location;
        vm.fruit = "";
        vm.averageRating = 1;
        vm.grocery = null;
        vm.reviews = [];
        vm.reviewsPage = [];
        vm.reviewsPages = [];
        vm.currentUser = null;


        // Event handler
        vm.rangeArray = rangeArray;
        vm.deleteFruit = deleteFruit;
        vm.getReviewsForPage = getReviewsForPage;
        vm.updateReviewPages = updateReviewPages;


        init();


        function init() {
            vm.fruit = $routeParams.fruit;
            vm.grocery = GroceryService.findGroceryStoreById($routeParams.id);
            vm.currentUser = UserService.getCurrentUser();
            vm.averageRating = ReviewService.getAverageRatingOfFruitAtGroceryStore(vm.fruit, vm.grocery._id);

            updateReviewPages();
        }

        function updateReviewPages() {
            // TODO: Reviews should be grabbed in order by date written.
            // Get the reviews to display without promises for now.
            vm.reviews = ReviewService.findAllReviewsForFruitAndGroceryStore(vm.fruit, vm.grocery._id);
            vm.reviewsPages = PagesService.splitItemsIntoPages(vm.reviews, 5);



            if ($routeParams.page) {
                vm.getReviewsForPage($routeParams.page);
            } else {
                vm.getReviewsForPage(1);
            }

        }

        function getReviewsForPage(page) {
            vm.reviewsPage = vm.reviewsPages[page-1];
            // Update the path to reflect the page change.
            $location.path("/grocery/" + vm.grocery._id.toString() + "/" + vm.fruit + "/" + page.toString());
        }

        function rangeArray(n) {
            return new Array(n);
        }

        /* Deletes the fruit from the system */
        function deleteFruit() {
            var r = ReviewService.deleteFruitReviews(vm.fruit, vm.grocery._id);
            $location.url("/grocery/" + vm.grocery._id.toString());
        }


    }
})();