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
                        vm.grocery = grocery;
                        return ReviewService .findAllReviewsForGroceryStore(vm.grocery._id);
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

                            vm.fruitsPages = PagesService.splitItemsIntoPages(vm.fruits, 10);
                            if ($routeParams.page) {
                                vm.getFruitsForPage($routeParams.page);
                            } else {
                                vm.getFruitsForPage(1);
                            }
                        }
                        getFollowingButtons();
                    }
                );
        }

        function getFollowingButtons() {
            if (vm.currentUser == null) {
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
            $location.path("/grocery/" + $routeParams.id + "/page=" + page.toString());
        }


        function search() {
            
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