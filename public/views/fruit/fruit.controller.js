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
        vm.status = 0; // 0 = normal, 1 = invalid grocery store, 2 = currently searching, 3 = invalid fruit


        // Event handler
        vm.rangeArray = rangeArray;
        vm.deleteFruit = deleteFruit;
        vm.getReviewsForPage = getReviewsForPage;
        vm.updateReviewPages = updateReviewPages;


        init();


        function init() {
            vm.fruit = $routeParams.fruit;
            vm.status = 2;
            GroceryService
                .findGroceryStoreById($routeParams.id)
                .then(
                    function (groceryStore) {
                        if (groceryStore) {
                            vm.grocery = groceryStore;
                            vm.status = 0;
                            return ReviewService.getAverageRatingOfFruitAtGroceryStore(vm.fruit, vm.grocery._id);
                        } else {
                            vm.status = 1;
                        }
                    }
                )
                .then(
                    function (response) {
                        if (response) {
                            vm.averageRating = response;
                            updateReviewPages();
                        }
                    }
                );

            vm.currentUser = UserService.getCurrentUser();
        }

        function updateReviewPages() {
            ReviewService
                .findAllReviewsForFruitAndGroceryStore(vm.fruit, vm.grocery._id)
                .then(
                    function (response) {
                        vm.reviews = response.data;
                        vm.reviewsPages = PagesService.splitItemsIntoPages(vm.reviews, 5);

                        if ($routeParams.page) {
                            vm.getReviewsForPage($routeParams.page);
                        } else {
                            vm.getReviewsForPage(1);
                        }
                    }
                );

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
        // FIXME: This has a bug
        function deleteFruit() {
            ReviewService
                .deleteFruitReviews(vm.fruit, vm.grocery._id)
                .then(
                    function (response) {
                        $location.url("/grocery/" + vm.grocery._id.toString());
                    },
                    function (err) {
                        alert("Problem deleting the fruit and all it's reviews.");
                    }
                );
        }


    }
})();