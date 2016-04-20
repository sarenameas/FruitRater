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

            vm.allGroceryStoresFollowing = vm.currentUser.groceryStoresFollowing;
            vm.allGroceryStoresFollowing.sort(compareGroceryNamesAscending);
            vm.groceryStoresPages = PagesService.splitItemsIntoPages(vm.allGroceryStoresFollowing,5);
            vm.getGroceryStoresForPage($routeParams.page);
        }

        /* Gets the grocery stores for the given integer page number. */
        function getGroceryStoresForPage(page) {
            vm.groceryStoresFollowing = vm.groceryStoresPages[page-1];
            $location.path("/profile/grocerystoresfollowing/"+ page.toString());
        }

        function unfollow(groceryId, $index) {
            vm.currentUser.groceryStoresFollowing.splice($index, 1);
            delete vm.currentUser.password;
            UserService
                .updateUser(vm.currentUser._id, vm.currentUser)
                .then(
                    function (response) {
                        updateGroceryStoresPages();
                    }
                );

        }

        function compareGroceryNamesAscending(a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return -1;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1;
            }
            // a must be equal to b
            return 0;
        }


    }
})();