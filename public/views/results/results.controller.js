(function () {
    angular
        .module("FruitRaterApp")
        .controller("ResultsController", resultsController);

    resultsController.$inject = ['$routeParams', 'GroceryService', 'ReviewService', 'UserService'];
    function resultsController($routeParams, GroceryService, ReviewService, UserService) {
        var vm = this;

        // Global variables
        vm.fruit = $routeParams.fruit.toLowerCase();
        vm.grocery = $routeParams.grocery.toLowerCase();
        vm.location = $routeParams.location;
        vm.results = [];
        vm.noResultText = "No Results Found...";
        vm.searchComb = "";
        vm.currentUser = UserService.getCurrentUser();

        var default_location = "Seattle";

        search();

        /* Searches with location and searchString if availible. */
        // TODO: For undefined searchString and location get client location and return local results for avacados or local walmarts
        function search() {
            var groceryStores = [];
            

            // There are 8 different combinations of searches for 3 different search feilds.
            // Fruits are reviews. Fruits only exist if there are reviews.
            // 1 = populated 0 = empty
            // fruit,grocery,location
            // 000 = display some recent fruit and grocery pages in the system for location gotten by ip address or profile indicated location.
            // 001 = display some grocery stores for this location.
            // 010 = display some grocery stores from location gotten by ip address or profile indicated location.
            // 011 = display some grocery stores for the given location
            // 100 = display some fruit-grocery links existing in the database for location gotten by ip address or profile indicated location.
            // 101 = display some fruit-grocery links existing in the database for the given location.
            // 110 = display some fruit-grocery links existing in the database for given grocery store and location gotten by ip address or 
            //       profile indicated location.
            // 111 = display some fruit-grocery links existing in the database for given fruit, grocery store, and location.


            if (vm.fruit === "empty") {
                vm.searchComb = "0";
            } else {
                vm.searchComb = "1";
            }
            if (vm.grocery === "empty") {
                vm.searchComb += "0";
            } else {
                vm.searchComb += "1";
            }
            if (vm.location === "empty") {
                vm.searchComb += "0";
            } else {
                vm.searchComb += "1";
            }

            switch (parseInt(vm.searchComb, 2)) {
                case 0:
                // TODO: Aggregate all reviews from the grocery stores
                // then display the top ones by fruit.
                var location = default_location;
                if (vm.currentUser && vm.currentUser.location) {
                    location = vm.currentUser.location;
                }
                
                GroceryService
                    .findGroceryStoresByLocation(location)
                    .then(
                        function (groceryStores) {
                            vm.results = groceryStores;
                        }
                    );
                break;
            case 1:
                GroceryService
                    .findGroceryStoresByLocation(vm.location)
                    .then(
                        function (groceryStores) {
                            vm.results = groceryStores;
                        }
                    );
                break;
            case 2:
                var location = default_location;
                if (vm.currentUser && vm.currentUser.location) {
                    location = vm.currentUser.location;
                }

                GroceryService
                    .findGroceryStoresByNameAndLocation(vm.grocery, location)
                    .then(
                        function (groceryStores) {
                            vm.results = groceryStores;
                        }
                    );
                break;
            case 3:
                GroceryService
                    .findGroceryStoresByNameAndLocation(vm.grocery, vm.location)
                    .then(
                        function (groceryStores) {
                            vm.results = groceryStores;
                        }
                    );
                break;

            case 4:
                var location = default_location;
                if (vm.currentUser && vm.currentUser.location) {
                    location = vm.currentUser.location;
                }
                GroceryService
                    .findGroceryStoresByLocation(location)
                    .then(
                        function (groceryStores) {
                            getReviewResultsFromGroceryStores(vm.fruit, groceryStores);
                        }
                    );
                break;
            case 5:
                GroceryService
                    .findGroceryStoresByLocation(vm.location)
                    .then(
                        function (results) {
                            groceryStores = results;
                            getReviewResultsFromGroceryStores(vm.fruit, groceryStores);
                        }
                    );
                break;
            case 6:
                var location = default_location;
                if (vm.currentUser && vm.currentUser.location) {
                    location = vm.currentUser.location;
                }
                GroceryService
                    .findGroceryStoresByNameAndLocation(vm.grocery, location)
                    .then (
                        function (results) {
                            groceryStores = results;
                            getReviewResultsFromGroceryStores(vm.fruit, groceryStores);
                        }
                    );
                break;
            case 7:
                GroceryService
                    .findGroceryStoresByNameAndLocation(vm.grocery, vm.location)
                    .then(
                        function (results) {
                            groceryStores = results;
                            getReviewResultsFromGroceryStores(vm.fruit, groceryStores);
                        }
                    );
                break;
            default:
                // Just display no results found.
            }
        }
        
        
        function getReviewResultsFromGroceryStores(fruit, groceryStores) {
            // For each grocery store get all reviews for that grocery store
            //  For each review find if that fruit is availible.
            //   If the fruit is availible then create a result for it + break
            var i;
            var j;
            
            for (i = 0; i < groceryStores.length; i++) {
                ReviewService
                    .findAllReviewsForGroceryStore(groceryStores[i]._id)
                    .then(
                        function (response) {
                            var reviews = response.data;
                            for (j = 0; j < reviews.length; j++) {
                                if (reviews[j].fruit === vm.fruit) {
                                    var result = {
                                        _id: reviews[j].groceryId,
                                        name: reviews[j].groceryName,
                                        address: reviews[j].groceryAddress,
                                        fruit: reviews[j].fruit
                                    }
                                    vm.results.push(result);
                                    break;
                                }
                            }
                        }
                    );
            }            
        }

    }
})();