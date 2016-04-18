// TODO: Minimize the number of requests to the database and to Yelp

(function () {
    angular
        .module("FruitRaterApp")
        .controller("GroceryController", groceryController);
        
    groceryController.$inject = ['$routeParams', '$location', 'GroceryService', 'PagesService', 'ReviewService', 'UserService'];
    function groceryController($routeParams, $location, GroceryService, PagesService, ReviewService, UserService) {
        var vm = this;
        
        // Global variables
        vm.grocery = null;
        vm.fruits = [];
        vm.searchFruit = "";
        vm.fruitsPages = [];
        vm.fruitsPage = []
        vm.currentUser = null;
        vm.unfollowVisible = false;
        vm.followVisisible = false;
        vm.error = 3; // 0 = no error, 1 = invalid grocery store, 2 = error on grocery search, 3 = searching groceries

        // Event Handlers
        vm.getFruitsForPage = getFruitsForPage;
        vm.search = search;
        vm.deleteGrocery = deleteGrocery;
        vm.follow = follow;
        vm.unfollow = unfollow;
        
        
        init();
        
        function init() {
            vm.currentUser = UserService.getCurrentUser();
            GroceryService
                .findGroceryStoreById($routeParams.id)
                .then(
                    function (grocery) {
                        if (grocery) {
                            vm.grocery = grocery;
                            vm.error = 0;
                            return ReviewService .findAllReviewsForGroceryStore(vm.grocery._id);
                        } else {
                            vm.error = 1;
                        }
                    },
                    function (err) {
                        vm.error = 2;
                    }
                )
                .then(
                    function (response) {
                        var allReviews = response.data;

                        if (allReviews.length > 0) {
                            var i;
                            for (i = 0; i < allReviews.length; i++) {
                                if(vm.fruits.indexOf(allReviews[i].fruit) === -1) {
                                    vm.fruits.push(allReviews[i].fruit);
                                }
                            }
                            vm.fruits.sort();
                            if ($routeParams.search) {
                                vm.searchFruit = $routeParams.search;
                                search($routeParams.search);
                            } else {
                                getFruitsPages(vm.fruits);
                            }

                        }
                        getFollowingButtons();
                    }
                );
        }

        function getFruitsPages(fruits) {
            // 12 is optimal for large displays, results with stack on cellphones.
            vm.fruitsPages = PagesService.splitItemsIntoPages(fruits, 12);
            if ($routeParams.page) {
                vm.getFruitsForPage($routeParams.page);
            } else {
                vm.getFruitsForPage(1);
            }
        }

        function getFollowingButtons() {
            if (vm.currentUser == null || vm.currentUser == "") {
                vm.unfollowVisible = false;
                vm.followVisible = false;
            }
            else if (vm.currentUser.groceryStoresFollowing.indexOf(vm.grocery._id) > -1) {
                vm.unfollowVisible = true;
                vm.followVisible = false;
            }
            else {
                vm.unfollowVisible = false;
                vm.followVisible = true;
            }
        }
        
        
        function getFruitsForPage(page) {
            vm.fruitsPage = vm.fruitsPages[page-1];
            if ($routeParams.search) {
                $location.path("/grocery/" + $routeParams.id + "/search=" + vm.searchFruit + "/page=" + page.toString());
            } else {
                $location.path("/grocery/" + $routeParams.id + "/page=" + page.toString());
            }

        }

        function search(fruit) {
            // This function is only shown when vm.fruit is populated.
            var i;
            var fruits = [];
            fruit = fruit.toLowerCase();
            if (fruit == null || fruit === "") {
                fruits = vm.fruits;
            } else {
                for (i = 0; i < vm.fruits.length; i++) {
                    if (vm.fruits[i].includes(fruit)) {
                        fruits.push(vm.fruits[i]);
                    }
                }
            }

            getFruitsPages(fruits);
        }

        function deleteGrocery() {
            GroceryService.deleteGroceryStore(vm.grocery._id);
            ReviewService
                .deleteGroceryStoreReviews(vm.grocery._id)
                .then(
                    function (response) {
                        vm.fruits = [];
                        vm.fruitsPage = [];
                        vm.fruitsPages = [];
                    },
                    function (err) {
                        alert("Problem with deleting this grocery store and all it's reviews.");
                    }
                );
        }

        function follow(groceryId) {
            if (vm.currentUser != null) {
                if (vm.currentUser.groceryStoresFollowing.indexOf(groceryId) === -1) {
                    vm.currentUser.groceryStoresFollowing.push(groceryId);
                    UserService
                        .updateUser(vm.currentUser._id, vm.currentUser)
                        .then(
                            function (response) {
                                vm.unfollowVisible = true;
                                vm.followVisible = false;
                            }
                        )

                }
            }

        }

        function unfollow(groceryId) {
            if (vm.currentUser != null) {
                var index = vm.currentUser.groceryStoresFollowing.indexOf(groceryId);
                if (index > -1) {
                    vm.currentUser.groceryStoresFollowing.splice(index, 1);
                    UserService
                        .updateUser(vm.currentUser._id, vm.currentUser)
                        .then(
                            function (response) {
                                vm.unfollowVisible = false;
                                vm.followVisible = true;
                            }
                        );

                }
            }

        }
    }
})();