(function () {
    angular
        .module("FruitRaterApp")
        .controller("HeaderController", headerController);

    headerController.$inject = ['$location', 'UserService'];
    function headerController($location, UserService) {
        var vm = this;

        // Global Variables
        //vm.$location = $location;
        vm.fruit = "";
        vm.grocery = "";
        vm.location = "";


        // Event Handlers
        vm.logOut = logOut;
        vm.search = search;

        // TODO: passport.js to handle credentials

        // Logs the user out using the UserService and sends the
        // client to the home page.
        function logOut() {
            UserService.setCurrentUser(null);

            // .url("...") takes us to the given "..."
            // .path("...") updates the path but doesn't take us there right away.
            $location.url("/home");
        }

        // Sends us to the results page
        function search(fruit, grocery, location) {
            if (fruit === "") { fruit = "empty"}
            if (grocery === "") { grocery = "empty" }
            if (location === "") { location = "empty" }
            $location.url("/results/fruit=" + fruit + "/grocery=" + grocery + "/location=" + location);
        }

    }
})();