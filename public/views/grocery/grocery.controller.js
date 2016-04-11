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
        
        // Event Handlers
        vm.getFruitsForPage = getFruitsForPage;
        vm.search = search;
        vm.deleteGrocery = deleteGrocery;
        // TODO: NEED TO ADD FOLLOW FUNCTION GROCERY STORES PAGES!!!!!!
        
        
        init();
        
        function init() {
            vm.currentUser = UserService.getCurrentUser();
            vm.grocery = GroceryService.findGroceryStoreById($routeParams.id);
            // For the given grocery ID we want to get all there reviews.
            // For all the reviews we want to extract the different fruits without duplicating.
            
            var allReviews = ReviewService.findAllReviewsForGroceryStore(vm.grocery._id);
            
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
            
        }
        
        
        function getFruitsForPage(page) {
            vm.fruitsPage = vm.fruitsPages[page-1];
            $location.path("/grocery/" + $routeParams.id + "/page=" + page.toString());
        }


        function search() {
            
        }

        function deleteGrocery() {
            GroceryService.deleteGroceryStore(vm.grocery._id);
            ReviewService.deleteGroceryStoreReviews(vm.grocery._id);
            vm.fruits = [];
            vm.fruitsPage = [];
            vm.fruitsPages = [];

        }
    }
})();