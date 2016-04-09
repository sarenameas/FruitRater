(function () {
    angular
        .module("FruitRaterApp")
        .controller("ReviewController", reviewController);

    reviewController.$inject = ['$routeParams', '$location', 'GroceryService', 'UserService', 'ReviewService'];
    function reviewController($routeParams, $location, GroceryService, UserService, ReviewService) {
        /* TODO: All view DOM manipulations should be in directives like errors on forms, star ratings,  etc.
           Controllers are for passing data and reading input data ONLY
         */

        var vm = this;

        // Globals
        vm.fruit = null;
        vm.grocery = null;
        vm.currentUser = null;
        vm.stars = ["&#x2606;", "&#x2606;", "&#x2606;", "&#x2606;", "&#x2606;"];
        vm.fruitError = false;
        vm.ratingError = false;
        vm.commentsError = false;
        vm.comments = "";
        vm.review = {};
        vm.edit = false;

        // Event Handlers
        vm.rate1star = rate1star;
        vm.rate2star = rate2star;
        vm.rate3star = rate3star;
        vm.rate4star = rate4star;
        vm.rate5star = rate5star;
        vm.submit = submit;



        init();

        function init() {
            vm.currentUser = UserService.getCurrentUser();

            vm.edit = $location.url().includes("edit");
            if (vm.edit) {
                vm.review = ReviewService.findReviewById(parseInt($routeParams.id));
                if (vm.review != null) {
                    vm.comments = vm.review.text;
                    vm.fruit = vm.review.fruit;
                    vm.grocery = GroceryService.findGroceryStoreById(vm.review.groceryId);
                    if (vm.review.rating === 1) {
                        rate1star();
                    }
                    else if(vm.review.rating === 2) {
                        rate2star();
                    }
                    else if(vm.review.rating === 3) {
                        rate3star();
                    }
                    else if(vm.review.rating === 4) {
                        rate4star();
                    }
                    else if(vm.review.rating === 5) {
                        rate5star();
                    }

                }
            } else {
                vm.fruit = $routeParams.fruit;
                vm.grocery = GroceryService.findGroceryStoreById($routeParams.groceryId);
            }
        }

        function rate1star() {
            vm.stars[0] = "&#x2605;";
            vm.stars[1] = "&#x2606;";
            vm.stars[2] = "&#x2606;";
            vm.stars[3] = "&#x2606;";
            vm.stars[4] = "&#x2606;";
        }

        function rate2star() {
            vm.stars[0] = "&#x2605;";
            vm.stars[1] = "&#x2605;";
            vm.stars[2] = "&#x2606;";
            vm.stars[3] = "&#x2606;";
            vm.stars[4] = "&#x2606;";
        }

        function rate3star() {
            vm.stars[0] = "&#x2605;";
            vm.stars[1] = "&#x2605;";
            vm.stars[2] = "&#x2605;";
            vm.stars[3] = "&#x2606;";
            vm.stars[4] = "&#x2606;";
        }

        function rate4star() {
            vm.stars[0] = "&#x2605;";
            vm.stars[1] = "&#x2605;";
            vm.stars[2] = "&#x2605;";
            vm.stars[3] = "&#x2605;";
            vm.stars[4] = "&#x2606;";
        }

        function rate5star() {
            vm.stars[0] = "&#x2605;";
            vm.stars[1] = "&#x2605;";
            vm.stars[2] = "&#x2605;";
            vm.stars[3] = "&#x2605;";
            vm.stars[4] = "&#x2605;";
        }

        function submit() {
            var submitOk = true;
            if (vm.fruit == null || vm.fruit === "") {
                vm.fruitError = true;
                submitOk = false
            }
            else {
                vm.fruitError = false;
            }

            if (totalRating() === 0) {
                vm.ratingError = true;
                submitOk = false;
            } else {
                vm.ratingError = false;
            }

            if (vm.comments == null || vm.comments === "") {
                vm.commentsError = true;
                submitOk = false;
            } else {
                vm.commentsError = false;
            }

            if (submitOk) {
                var review = {
                    "fruit": vm.fruit.toLowerCase(),
                    "groceryId": vm.grocery._id,
                    "userId": vm.currentUser._id,
                    "rating": totalRating(),
                    "date": new Date(),
                    "text": vm.comments
                };
                if (vm.edit) {
                    ReviewService.updateReview(vm.review._id, review);
                    $location.url("/grocery/" + vm.grocery._id + "/" + vm.fruit + "/1");
                } else {
                    ReviewService.createReview(review);
                    $location.url("/grocery/" + $routeParams.groceryId + "/" + vm.fruit + "/1");
                }


            }
        }

        /* Returns the total rating input */
        function totalRating() {
            var i;
            var count = 0;
            for (i = 0; i < vm.stars.length; i++) {
                if (vm.stars[i] === "&#x2605;") {
                    count += 1;
                }
            }
            return count;
        }


    }
})();