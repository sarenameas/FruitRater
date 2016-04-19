(function () {
    angular
        .module("FruitRaterApp")
        .controller("GroceryStoresFollowingController", groceryStoresFollowingController);

    groceryStoresFollowingController.$inject = ['UserService', 'PagesService', 'GroceryService', '$routeParams', '$location'];
    function groceryStoresFollowingController(UserService, PagesService, GroceryService, $routeParams, $location) {
        var vm = this;
        vm.$location = $location;

        // Globals
        vm.currentUser = null;
        vm.allGroceryStoresFollowing = [];
        vm.groceryStoresFollowing = [];
        vm.groceryStoresPages = [];

        // Event handlers
        vm.getGroceryStoresForPage = getGroceryStoresForPage;
        vm.unfollow = unfollow;



        init();

        // TODO: Perhaps create directives for each type of page ... this is repeated code...
        function init() {
            vm.currentUser = UserService.getCurrentUser();

            if (vm.currentUser == null) {
                $location.url('/home');
                return;
            }
            updateGroceryStoresPages();
        }

        function updateGroceryStoresPages() {
            var i;

            vm.allGroceryStoresFollowing = [];

            for (i = 0; i < vm.currentUser.groceryStoresFollowing.length; i++) {
                GroceryService
                    .findGroceryStoreById(vm.currentUser.groceryStoresFollowing[i])
                    .then(
                        function (groceryStore) {
                            vm.allGroceryStoresFollowing.push( groceryStore );

                            // FIXME: Need to get a all grocery stores from service fully for a user to render properly.
                            // TODO: Also sort grocery stores
                            // TODO: Split grocery stores in array into pages for less yelp searches
                            vm.groceryStoresPages = PagesService.splitItemsIntoPages(vm.allGroceryStoresFollowing,5);
                            vm.getGroceryStoresForPage($routeParams.page);

                        }
                    );
            }



        }

        /* Gets the grocery stores for the given integer page number. */
        function getGroceryStoresForPage(page) {
            vm.groceryStoresFollowing = vm.groceryStoresPages[page-1];
            $location.path("/profile/grocerystoresfollowing/"+ page.toString());
        }

        function unfollow(groceryId) {
            var index = vm.currentUser.groceryStoresFollowing.indexOf(groceryId);
            vm.currentUser.groceryStoresFollowing.splice(index, 1);
            delete vm.currentUser.password;
            UserService
                .updateUser(vm.currentUser._id, vm.currentUser)
                .then(
                    function (response) {
                        updateGroceryStoresPages();
                    }
                );

        }


    }
})();